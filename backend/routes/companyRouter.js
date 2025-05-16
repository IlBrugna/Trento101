import express from 'express'; //IMPORTA EXPRESS
import {
    getAllCompanies,
    getSpecificCompany,
    postCompany,
    putCompany
} from '../controllers/companyController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER
//router si riferisce a localhost:PORT/company

router.get("/", getAllCompanies); //AGGIUNGERE PARAMETRO
router.get('/:companyID', getSpecificCompany);
router.post('/',postCompany);
router.put('/:companyID', putCompany);
export default router; //ESPORTA IL ROUTER