import express from 'express';
import {
    getServiziComune,
    getServizioComune,
    postServizioComune,
    putServizioComune,
    deleteServizioComune
} from '../controllers/serviziComuneController.js';
import { trackComuneServiceClick } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/', getServiziComune);
router.get('/:serviceID', getServizioComune);
router.post('/', postServizioComune);
router.put('/:serviceID', putServizioComune);
router.delete('/:serviceID', deleteServizioComune);

// Tracking click RESTful
router.post('/:serviceID/clicks', trackComuneServiceClick);

export default router;
