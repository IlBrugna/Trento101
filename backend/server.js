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
import statisticsRouter from './routes/statisticsRouter.js'; // Importa il router per le statistiche
import cookieParser from 'cookie-parser';
import universitaRouter from './routes/serviziUniversitaRouter.js'; // Importa il router delle aziende 
import { initMailer } from './utils/mailUtils.js'; // Importa la funzione per inizializzare il mailer
import { recordEvent } from './utils/recordEventUtils.js'; // Importa la funzione per registrare gli eventi
import emailVerificationRouter from './routes/emailVerificationRouter.js';
import logRouter from './routes/logRouter.js';
dotenv.config({path:'./config/.env'}); // Carica le variabili d'ambiente dal file .env

//TEST DEPLOY
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'http://localhost:5000',
  'https://trento101.onrender.com'
];

const app = express();


app.use(express.json()); // ATTIVA IL MIDDLEWARE JSON
app.use(cookieParser()); // ATTIVA IL MIDDLEWARE PER LE COOKIES

// Per il logging degli eventi di visualizzazione delle pagine
app.use(async (req, res, next) => {
    const isStats = req.originalUrl.startsWith('/api/v1/stats');
    const isAuth = req.originalUrl.startsWith('/api/v1/auth');
    const isPage = req.originalUrl.startsWith('/api/v1/');
    res.on('finish', () => {
    // Registra un evento di visualizzazione della pagina solo per le richieste GET con successo
    if (req.method === 'GET' && res.statusCode < 400 && !isStats && !isAuth && isPage) {
        recordEvent(req, 'page_view');
    }
    });
    next();
});

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no Origin header (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET','POST','PUT','PATCH','DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
  })
);


await initMailer();

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

//TEST DEPLOY
app.use('/', express.static(path.join(__dirname, 'dist')));

// API versioning
const API_VERSION = 'v1';
const API_BASE_PATH = `/api/${API_VERSION}`;

// Routes with versioning
app.use(`${API_BASE_PATH}/companies`, companyRouter);
app.use(`${API_BASE_PATH}/serviziComune`, comuneRouter);
app.use(`${API_BASE_PATH}/comuneNews`, newsRouter);
app.use(`${API_BASE_PATH}/auth`, authRouter);
app.use(`${API_BASE_PATH}/serviziUniversita`, universitaRouter);
app.use(`${API_BASE_PATH}/richiesteSupporto`, richiesteSupportoRouter);
app.use(`${API_BASE_PATH}/polls`, pollsRouter);
app.use(`${API_BASE_PATH}/stats`, statisticsRouter);
app.use(`${API_BASE_PATH}/email-verification`, emailVerificationRouter);
app.use(`${API_BASE_PATH}/logs`, logRouter);

// SPA fallback: restituisce index.html per ogni rotta non gestita
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

connectDB(); //CONNETTI AL DB

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
    console.log(`API base path: http://localhost:${process.env.PORT}${API_BASE_PATH}`);
});

process.on('SIGINT', disconnectDB);
process.on('SIGTERM', disconnectDB);