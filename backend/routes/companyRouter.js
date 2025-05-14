import express from 'express'; //IMPORTA EXPRESS
import {
    getAllCompanies,
    getSpecificCompany,
    putCompany
} from '../controllers/companyController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER
//router si riferisce a localhost:PORT/company

router.get("/", getAllCompanies);
router.get('/:companyID', getSpecificCompany);
router.post('/',putCompany);

export default router; //ESPORTA IL ROUTER