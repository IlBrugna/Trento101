import express from 'express';
import { Login} from '../controllers/authController.js';
import ValidateAuth from '../middleware/authMiddleware.js'; //IMPORTA IL MIDDLEWARE DI VALIDAZIONE
import {check } from 'express-validator'; 

const router = express.Router(); //CREA ROUTER

router.post('/login', check("email").isEmail().withMessage("Inserisci una email valida").normalizeEmail(),check("password").not().isEmpty(), ValidateAuth, Login); //funzioni senza parentesei perché passare per riferimento

export default router; //ESPORTA IL ROUTER