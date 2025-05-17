import express from 'express';
import {
    getAllServices,
    getSpecificService,
    createService,
    updateService,
    deleteService
} from '../controllers/comuneController.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:serviceID', getSpecificService);
router.post('/', createService);
router.put('/:serviceID', updateService);
router.delete('/:serviceID', deleteService);

export default router;
