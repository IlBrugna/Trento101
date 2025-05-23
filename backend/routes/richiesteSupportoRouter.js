import express from 'express';
import {
    getAllSupportRequests,
    getSupportRequest,
    postSupportRequest
} from '../controllers/richiesteSupportoController.js';

const router = express.Router();

router.post('/', postSupportRequest);

export default router;
