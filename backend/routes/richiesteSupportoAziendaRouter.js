import express from 'express';
import {
  getAllSupportRequestsAzienda,
  getSupportRequestAzienda,
  postSupportRequestAzienda,
  putSupportRequestAzienda,
  deleteSupportRequestAzienda,
  replyToRequestAzienda
} from '../controllers/richiesteSupportoAziendaController.js';

const router = express.Router();

router.get('/', getAllSupportRequestsAzienda);
router.get('/:supportRequestID', getSupportRequestAzienda);
router.post('/', postSupportRequestAzienda);
router.put('/:supportRequestID', putSupportRequestAzienda);
router.delete('/:supportRequestID', deleteSupportRequestAzienda);
router.post('/:supportRequestID/reply', replyToRequestAzienda);

export default router;
