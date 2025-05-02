import express from 'express';
const app = express();
const port = 3000;

import testRouter from './routes/testRoute.js'; // Importa il router
app.use('/',testRouter)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});