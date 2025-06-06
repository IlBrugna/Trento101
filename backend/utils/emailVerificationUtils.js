import emailVerificationModel from '../models/emailVerificationModel.js';
import { sendMail } from './mailUtils.js';

// Genera un codice di verifica a 6 cifre
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (email) => {
    try {
        await emailVerificationModel.deleteMany({ email }); //PULIZIA EVENTUALI PRECEDENTI

        const code = generateVerificationCode();
        
        const verification = new emailVerificationModel({
            email,
            code
        });
        await verification.save();
        
        const subject = 'Conferma la tua email - TRENTO 101';
        const text = `Il tuo codice di verifica è: ${code}\n\nQuesto codice scadrà tra 10 minuti.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Benvenuto in TRENTO 101!</h2>
                <p>Grazie per aver iniziato la registrazione della tua azienda.</p>
                <p>Per continuare, inserisci questo codice di verifica:</p>
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                    <h1 style="color: #1f2937; font-size: 32px; margin: 0; letter-spacing: 4px;">${code}</h1>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                    Questo codice scadrà tra 10 minuti.<br>
                    Se non hai richiesto questa verifica, puoi ignorare questa email.
                </p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px;">TRENTO 101 - Il portale delle aziende di Trento</p>
            </div>
        `;
        
        await sendMail({
            to: email,
            subject,
            text,
            html
        });
        
        return { success: true, message: 'Email di verifica inviata' };
    } catch (error) {
        console.error('Errore invio email verifica:', error);
        throw new Error('Errore durante l\'invio dell\'email di verifica');
    }
};

export const verifyCode = async (email, code) => {
    try {
        const verification = await emailVerificationModel.findOne({
            email,
            code,
            verified: false
        });
        
        if (!verification) {
            return { success: false, message: 'Codice non valido o scaduto' };
        }
        
        verification.verified = true;
        await verification.save();
        
        return { success: true, message: 'Email verificata con successo' };
    } catch (error) {
        console.error('Errore verifica codice:', error);
        throw new Error('Errore durante la verifica del codice');
    }
};

export const isEmailVerified = async (email) => {
    try {
        const verification = await emailVerificationModel.findOne({
            email,
            verified: true
        });
        
        return !!verification;
    } catch (error) {
        console.error('Errore controllo verifica email:', error);
        return false;
    }
};