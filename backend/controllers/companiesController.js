import companyModel from "../models/companiesModel.js"; // IMPORTA IL MODELLO
import { Types } from "mongoose"; // IMPORTA MONGOOSE
import { hashPassword } from '../utils/hashutils.js';
import { recordEvent } from "../utils/recordEventUtils.js"; // IMPORTA LA FUNZIONE PER REGISTRARE GLI EVENTI
import { isEmailVerified } from '../utils/emailVerificationUtils.js';

export const getCompanies = async (req, res) => {
  const { email, isActive } = req.query; // OTTENGO EMAIL DALLA RICHIESTA
  if (email) {
    const company = await companyModel.findOne({ email });
    if (company) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }}

    try {
      const filtro = {};
      if (isActive !== undefined) {
        if (isActive === 'true') filtro.isActive = true; //PARAMETRI QUERY SONO STRINGE!! VANNO CONVERTITE A BOOL
        else if (isActive === 'false') filtro.isActive = false;
        else {  
         return res.status(400).json({ message: 'Parametro isActive non valido, usa true o false' });
        }
      }

    const companies = await companyModel.find(filtro);

    return res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ message: "Errore durante il recupero delle aziende" });
    }
  };

export const getCompany = async (req, res) => {
  try {
        const companyID = req.params.companyID; //OTTENGO ID DALLA RICHIESTA
        if (!Types.ObjectId.isValid(companyID)) {
           return res.status(400).json({ message: 'ID non valido' });
        }  
        const company = await companyModel.findById(companyID); //CERCO L'AZIENDA NEL DATABASE
        if (!company) {
            return  res.status(404).json({ message: 'Azienda non trovata' }); //SE NON TROVO L'AZIENDA
        }
        return res.status(200).json(company); //SE TROVO L'AZIENDA, RISPONDO CON I SUOI DATI
    } catch (error) {
        return res.status(500).json({ message: 'Errore durante il recupero dell\'azienda' }); //SE C'E' UN ERRORE
    }
}

export const postCompany = async (req, res) => {
  try{
    const companyData = req.body;
    //VERIFICA REGISTRAZIONE 
    const emailVerified = await isEmailVerified(companyData.email);
    if (!emailVerified) {
      return res.status(400).json({ 
        message: 'Email non verificata. Completa prima la verifica dell\'email.' 
      });
    }
    
    companyData.password = await hashPassword(companyData.password); //hash password presalvataggio
    const newCompany = new companyModel(companyData);
    await newCompany.save(); //SALVO AZIENDA
    const {password, ...company} = newCompany._doc; //DESTRUTTURAZIONE PER NON RITORNARE LA PASSWORD
    await recordEvent(req, 'company_created', { companyId: newCompany._id });
    return res.status(201).json(company); 
  }catch(error){
    console.error(error.message);
    return res.status(500).json({ message: 'Errore durante la creazione dell\'azienda' });
  }
}

export const putCompany = async (req, res) => {
  try {
        const companyID = req.params.companyID; 
        if (!Types.ObjectId.isValid(companyID)) {
           return res.status(400).json({ message: 'ID non valido' });
        }  
        const dati=req.body;
        const company = await companyModel.findByIdAndUpdate(companyID,dati,{new:true}); //new true torna la versione aggironata
        if (!company) {
            return  res.status(404).json({ message: 'Azienda non trovata' });
        }
        await recordEvent(req, 'company_updated', { companyId: company._id });
        return res.status(200).json(company); 
    } catch (error) {
        return res.status(500).json({ message: 'Errore durante la modifica dell\'azienda' }); //SE C'E' UN ERRORE
    }
}

export const deleteCompany = async (req, res) => {
  try {
        const companyID = req.params.companyID; 
        if (!Types.ObjectId.isValid(companyID)) {
           return res.status(400).json({ message: 'ID non valido' });
        }  
        const company = await companyModel.findByIdAndDelete(companyID);
        if (!company) {
            return  res.status(404).json({ message: 'Azienda non trovata' });
        }
        recordEvent(req, 'company_deleted', { companyId: company._id });
        return res.status(200).json(company); 
    } catch (error) {
        return res.status(500).json({ message: 'Errore durante l\'eleminazione dell\'azienda' }); //SE C'E' UN ERRORE
    }
}
