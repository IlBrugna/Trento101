import express from 'express'; //IMPORTA EXPRESS
import {
    getAllCompanies,
    getSpecificCompany 
} from '../controllers/companyController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER

// `/company` --> tutte le aziende
router.get("/", getAllCompanies);
// `/company/:companyID` --> azienda specifica
router.get('/:companyID', getSpecificCompany);

export default router; //ESPORTA IL ROUTER