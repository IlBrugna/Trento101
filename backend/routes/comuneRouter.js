import express from 'express';
import {
    getServiziComune,
    getServizioComune,
    postServizioComune,
    putServizioComune,
    deleteServizioComune
} from '../controllers/comuneController.js';

const router = express.Router();

router.get('/', getServiziComune);
router.get('/:serviceID', getServizioComune);
router.post('/', postServizioComune);
router.put('/:serviceID', putServizioComune);
router.delete('/:serviceID', deleteServizioComune);

export default router;
