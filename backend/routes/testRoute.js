import express from 'express'; //IMPORTA EXPRESS
import { home, inner, database } from '../controllers/testController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER

router.get('/', home );
router.get('/inner', inner);
router.get('/database', database);

export default router; //ESPORTA IL ROUTER, DEFAULT COSì PUO AVERE NOME A SCELTA