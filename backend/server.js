import express from 'express';
import {connectDB, disconnectDB} from './config/db.js'; // Importa la connessione al database
import dotenv from 'dotenv'; // Importa dotenv per le variabili d'ambiente
dotenv.config({path:'./config/.env'}); // Carica le variabili d'ambiente dal file .env
const app = express();

console.log(process.env.PORT);

import testRouter from './routes/testRoute.js'; // Importa il router
app.use(express.json()); // ATTIVA IL MIDDLEWARE JSON
app.use('/api', testRouter)

connectDB(); //CONNETTI AL DB

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});

process.on('SIGINT', disconnectDB)
process.on('SIGTERM', disconnectDB)