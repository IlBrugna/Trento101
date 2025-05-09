import express from 'express';
import {connectDB, disconnectDB} from './config/db.js'; // Importa la connessione al database
import dotenv from 'dotenv'; // Importa dotenv per le variabili d'ambiente
import companyRouter from './routes/companyRouter.js'; // Importa il router delle aziende 
dotenv.config({path:'./config/.env'}); // Carica le variabili d'ambiente dal file .env
const app = express();



app.use(express.json()); // ATTIVA IL MIDDLEWARE JSON
app.use('/company', companyRouter)

connectDB(); //CONNETTI AL DB

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});

process.on('SIGINT', disconnectDB)
process.on('SIGTERM', disconnectDB)