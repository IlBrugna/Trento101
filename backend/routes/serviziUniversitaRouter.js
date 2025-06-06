import express from 'express';
import {
    getServiziUniversita,
    getServizioUniversita,
    postServizioUniversita,
    putServizioUniversita,
    deleteServizioUniversita
} from '../controllers/serviziUniversitaController.js';
import { trackUniversitaServiceClick } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/', getServiziUniversita);
router.get('/:serviceID', getServizioUniversita);
router.post('/', postServizioUniversita);
router.put('/:serviceID', putServizioUniversita);
router.delete('/:serviceID', deleteServizioUniversita);

// Tracking click RESTful
router.post('/:serviceID/clicks', trackUniversitaServiceClick);

export default router;