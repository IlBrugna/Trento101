import express from 'express';
import {
    getAllSupportRequests,
    getSupportRequest,
    postSupportRequest,
    putSupportRequest,
    deleteSupportRequest,
    replyToRequest
} from '../controllers/richiesteSupportoController.js';

const router = express.Router();

router.get('/', getAllSupportRequests);
router.get('/:supportRequestID', getSupportRequest);
router.post('/', postSupportRequest);
router.put('/:supportRequestID', putSupportRequest);
router.delete('/:supportRequestID', deleteSupportRequest);
router.post('/:supportRequestID/reply', replyToRequest);

export default router;
