import companyModel from "../models/companyModel.js"; // IMPORTA IL MODELLO

export const getSpecificCompany = async (req, res) => {
    try {
        const companyID = req.params.companyID; //OTTENGO ID DALLA RICHIESTA
        const company = await companyModel.findById(companyID); //CERCO L'AZIENDA NEL DATABASE
        if (!company) {
            res.status(404).json({ message: 'Azienda non trovata' }); //SE NON TROVO L'AZIENDA
        }
        res.status(200).json(company); //SE TROVO L'AZIENDA, RISPONDO CON I SUOI DATI
    } catch (error) {
        res.status(500).json({ message: 'Errore durante il recupero dell\'azienda' }); //SE C'E' UN ERRORE
    }
}