import companyModel from "../models/companyModel.js"; // IMPORTA IL MODELLO
import { Types } from "mongoose"; // IMPORTA MONGOOSE

// GET /company --> tutte le aziende
export const getAllCompanies = async (req, res) => {
    try {
      const companies = await companyModel.find(); // tutti i documenti
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ message: "Errore durante il recupero delle aziende" });
    }
  };
// GET /company/:companyID --> azienda singola
export const getSpecificCompany = async (req, res) => {
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