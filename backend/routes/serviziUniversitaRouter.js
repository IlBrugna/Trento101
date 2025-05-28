import express from 'express';
import {
    getServiziUniversita,
    getServizioUniversita,
    postServizioUniversita,
    putServizioUniversita,
    deleteServizioUniversita
} from '../controllers/serviziUniversitaController.js';

const router = express.Router();

router.get('/', getServiziUniversita);
router.get('/:serviceID', getServizioUniversita);
router.post('/', postServizioUniversita);
router.put('/:serviceID', putServizioUniversita);
router.delete('/:serviceID', deleteServizioUniversita);

export default router;