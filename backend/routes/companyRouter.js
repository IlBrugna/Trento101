import express from 'express'; //IMPORTA EXPRESS
import { getSpecificCompany } from '../controllers/companyController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER

router.get('/:companyID', getSpecificCompany); //GET PER OTTENERE UNA SPECIFICA AZIENDA

export default router; //ESPORTA IL ROUTER