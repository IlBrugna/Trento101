import express from 'express';
import {connectDB, disconnectDB} from './config/db.js'; // Importa la connessione al database
const app = express();
const port = 3000;

import testRouter from './routes/testRoute.js'; // Importa il router
app.use(express.json()); // ATTIVA IL MIDDLEWARE JSON
app.use('/',testRouter)

connectDB(); //CONNETTI AL DB

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', disconnectDB)
process.on('SIGTERM', disconnectDB)