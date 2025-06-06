import { sendVerificationEmail, verifyCode, isEmailVerified } from '../utils/emailVerificationUtils.js';
import companyModel from '../models/companiesModel.js';
import { recordEvent } from "../utils/recordEventUtils.js";

export const postEmailVerification = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
        const existingCompany = await companyModel.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ 
                message: 'Questa email è già registrata' 
            });
        }
        
        await sendVerificationEmail(email);
   
        return res.status(200).json({ 
            message: 'Codice di verifica inviato alla tua email' 
        });
        
    } catch (error) {
        console.error('Errore invio codice verifica:', error);
        return res.status(500).json({ 
            message: 'Errore durante l\'invio del codice di verifica' 
        });
    }
};


export const putEmailVerification = async (req, res) => {
    const { email, code } = req.body;
    
    try {
        const result = await verifyCode(email, code);
        
        if (result.success) {
            await recordEvent(req, 'email_verified', { email });
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
        
    } catch (error) {
        console.error('Errore verifica codice:', error);
        return res.status(500).json({ 
            message: 'Errore durante la verifica del codice' 
        });
    }
};


export const getEmailVerification = async (req, res) => {
    const { email } = req.query;
    
    try {
        const isVerified = await isEmailVerified(email);
        
        return res.status(200).json({ 
            verified: isVerified 
        });
        
    } catch (error) {
        console.error('Errore controllo verifica:', error);
        return res.status(500).json({ 
            message: 'Errore durante il controllo della verifica' 
        });
    }
};