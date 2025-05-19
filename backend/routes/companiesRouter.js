import express from 'express'; //IMPORTA EXPRESS
import {
    deleteCompany,
    getCompanies,
    getCompany,
    postCompany,
    putCompany
} from '../controllers/companiesController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER
//router si riferisce a localhost:PORT/company

router.get("/", getCompanies); //AGGIUNGERE PARAMETRO
router.get('/:companyID', getCompany);
router.post('/',postCompany);
router.put('/:companyID', putCompany);
router.delete('/:companyID',deleteCompany);
export default router; //ESPORTA IL ROUTER