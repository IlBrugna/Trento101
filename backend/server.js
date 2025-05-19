import express from 'express';
import cors from "cors"; // Importa cors per la gestione delle richieste cross-origin
import {connectDB, disconnectDB} from './config/db.js'; // Importa la connessione al database
import dotenv from 'dotenv'; // Importa dotenv per le variabili d'ambiente
import companyRouter from './routes/companyRouter.js'; // Importa il router delle aziende 
import comuneRouter from './routes/comuneRouter.js'; // Importa il router delle aziende 
import newsRouter from './routes/newsRouter.js'; // Importa il router delle news
import authRouter from './routes/authRouter.js'; // Importa il router per l'autenticazione
import cookieParser from 'cookie-parser';
dotenv.config({path:'./config/.env'}); // Carica le variabili d'ambiente dal file .env
const app = express();

app.use(express.json()); // ATTIVA IL MIDDLEWARE JSON
app.use(cookieParser()); // ATTIVA IL MIDDLEWARE PER LE COOKIES

app.use(
    cors({
        origin: "http://localhost:5000",   // <‑‑ porta di Vite
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true                 // per leggere cookies
    })
);

// API versioning
const API_VERSION = 'v1';
const API_BASE_PATH = `/api/${API_VERSION}`;

// Routes with versioning
app.use(`${API_BASE_PATH}/companies`, companyRouter);
app.use(`${API_BASE_PATH}/comuneServizi`, comuneRouter);
app.use(`${API_BASE_PATH}/comuneNews`, newsRouter);
app.use(`${API_BASE_PATH}/auth`, authRouter);

connectDB(); //CONNETTI AL DB

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
    console.log(`API base path: http://localhost:${process.env.PORT}${API_BASE_PATH}`);
});

process.on('SIGINT', disconnectDB);
process.on('SIGTERM', disconnectDB);