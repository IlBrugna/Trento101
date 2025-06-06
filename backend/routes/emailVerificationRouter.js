import express from 'express';
import { postEmailVerification, putEmailVerification, getEmailVerification } from '../controllers/emailVerificationController.js';
import { check } from 'express-validator';
import ValidateAuth from '../middleware/authInputMiddleware.js';

const router = express.Router();

router.post('/', 
    check("email").isEmail().withMessage("Inserisci una email valida").normalizeEmail(),
    ValidateAuth,
    postEmailVerification
);

router.put('/',
    [
        check("email").isEmail().withMessage("Inserisci una email valida").normalizeEmail(),
        check("code").isLength({ min: 6, max: 6 }).withMessage("Il codice deve essere di 6 cifre")
    ],
    ValidateAuth,
    putEmailVerification
);

router.get('/',
    check("email").isEmail().withMessage("Inserisci una email valida").normalizeEmail(),
    ValidateAuth,
    getEmailVerification
);

export default router;