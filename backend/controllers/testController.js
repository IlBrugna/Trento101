import testModel from "../models/testmodel.js"; // IMPORTA IL MODELLO

export const home = (req,res)=>{
    const message = "this is the home route";
    res.send(message);
}

export const inner = (req,res)=>{
    const message = "this is the inner route";
    res.send(message);
}

export const database = async (req, res) => {
    try {
        const test = await testModel.find({}); // Trova tutti i documenti nel modello Test
        res.status(200).json(test); // Invia i risultati come risposta JSON
    } catch (error) {
        res.status(500).json({ message: 'Errore durante il recupero dei dati dal database' });
    }
}