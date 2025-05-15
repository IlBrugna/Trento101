import express from 'express';
import { Login, logout} from '../controllers/authController.js';
import ValidateAuth from '../middleware/authInputMiddleware.js'; //IMPORTA IL MIDDLEWARE DI VALIDAZIONE
import {check } from 'express-validator'; 
import checkCompanyAuth from '../middleware/companyAuthMiddleware.js';
const router = express.Router(); //CREA ROUTER

router.post('/', check("email").isEmail().withMessage("Inserisci una email valida").normalizeEmail(),check("password").not().isEmpty(), ValidateAuth, Login); //funzioni senza parentesei perché passare per riferimento
router.get('/', checkCompanyAuth, (req, res) => {
    res.status(200).json({ company: req.company });
});
router.delete('/', logout);


/*
vedere se ha senso renderlo post, get, delete, SPOSTARE IN COMPANY?
//SPOSTARE TOKEN NON VALIDO SPOSTARE IN FRONTEND

*/

export default router; //ESPORTA IL ROUTER