import express from 'express';
import {
    getAllServices,
    getSpecificService,
    putService,
} from '../controllers/comuneController.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:serviceID', getSpecificService);
router.post('/', putService);

export default router;
