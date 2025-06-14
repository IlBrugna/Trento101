import companyModel from "../models/companiesModel.js"; // IMPORTA IL MODELLO
import adminModel from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import { verifyPassword } from '../utils/hashUtils.js';
import { recordEvent } from "../utils/recordEventUtils.js"; // IMPORTA LA FUNZIONE PER REGISTRARE GLI EVENTI
import { recordLogin } from '../utils/logUtils.js';

export const Login = async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await adminModel.findOne({ email }).select('+password'); //PRIMA CONTROLLO SE ADMIN
        let role = "admin";
        if (!user) {
            user = await companyModel.findOne({ email }).select('+password'); //CONTROLLO SE COMPANY
            role = "company";
        }
    
        if (!user) {
            return res.status(404).json({message: 'Utente non trovato'});
        }
        const isMatch = await verifyPassword(password, user.password);//uso bycrpt
        if (!isMatch) {
            await recordLogin(req, user.email, false);
            return res.status(401).json({message: 'Password errata'});
        }
        const {password: pass, ...userData} = user._doc; //DESTRUTTURAZIONE PER NON RITORNARE LA PASSWORDspieg
        
        res.cookie('AuthToken', user.generateAuthToken(), {
            maxAge: 30 * 60 * 1000, //BROWSER CANCELLA DOPO X MILLISECONDI
            httpOnly: true, // IMPEDISCE A CLIENT JAVASCRIPT DI MOFICIARLO
            secure: true, //FORZA HTTPS
            sameSite: 'None', //vanno bene richieste cross site
        });
        await recordLogin(req, user.email, true);
        await recordEvent(req, 'login');
        return res.status(200).json({message: 'Login effettuato con successo', role, userData });

    } catch (error) {
        return res.status(500).json({ message: 'Errore durante il recupero dell\'azienda'});
    }
    res.end();
}

export const logout = async (req, res) => {
    res.clearCookie('AuthToken'); //CANCELLA IL COOKIE
    await recordEvent(req, 'logout');
    return res.status(200).json({message: 'Logout effettuato con successo'});
};

