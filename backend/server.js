import express from 'express';
import cors from "cors"; // Importa cors per la gestione delle richieste cross-origin
import {connectDB, disconnectDB} from './config/db.js'; // Importa la connessione al database
import dotenv from 'dotenv'; // Importa dotenv per le variabili d'ambiente
import companyRouter from './routes/companiesRouter.js'; // Importa il router delle aziende 
import comuneRouter from './routes/serviziComuneRouter.js'; // Importa il router delle aziende 
import newsRouter from './routes/newsRouter.js'; // Importa il router delle news
import authRouter from './routes/authRouter.js'; // Importa il router per l'autenticazione
import richiesteSupportoRouter from './routes/richiesteSupportoRouter.js'; // Importa il router per le richieste di supporto
import pollsRouter from './routes/pollsRouter.js'; // Importa il router per i sondaggi
import cookieParser from 'cookie-parser';
import { initMailer } from './utils/mailUtils.js'; // Importa la funzione per inizializzare il mailer
dotenv.config({path:'./config/.env'}); // Carica le variabili d'ambiente dal file .env

const allowedOrigins = [
  'http://localhost:5000',
];

const app = express();


app.use(express.json()); // ATTIVA IL MIDDLEWARE JSON
app.use(cookieParser()); // ATTIVA IL MIDDLEWARE PER LE COOKIES

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no Origin header (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

await initMailer();

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API versioning
const API_VERSION = 'v1';
const API_BASE_PATH = `/api/${API_VERSION}`;

// Routes with versioning
app.use(`${API_BASE_PATH}/companies`, companyRouter);
app.use(`${API_BASE_PATH}/serviziComune`, comuneRouter);
app.use(`${API_BASE_PATH}/comuneNews`, newsRouter);
app.use(`${API_BASE_PATH}/auth`, authRouter);
app.use(`${API_BASE_PATH}/richiesteSupporto`, richiesteSupportoRouter);
app.use(`${API_BASE_PATH}/polls`, pollsRouter);

connectDB(); //CONNETTI AL DB

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
    console.log(`API base path: http://localhost:${process.env.PORT}${API_BASE_PATH}`);
});

process.on('SIGINT', disconnectDB);
process.on('SIGTERM', disconnectDB);