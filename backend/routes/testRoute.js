import express from 'express'; //IMPORTA EXPRESS
import { home, inner, database } from '../controllers/testController.js'; //IMPORTA LE FUNZIONI DAL CONTROLLER

const router = express.Router(); //CREA ROUTER

router.get('/', home );
router.get('/inner', inner);
router.get('/database', database);

router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });

export default router; //ESPORTA IL ROUTER, DEFAULT COSì PUO AVERE NOME A SCELTA