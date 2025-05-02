import express from 'express'; //IMPORTA EXPRESS
import { home, inner } from '../controllers/testController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER

router.get('/', home );
router.get('/inner', inner);

export default router; //ESPORTA IL ROUTER, DEFAULT COSì PUO AVERE NOME A SCELTA