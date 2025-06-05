import express from 'express';
import { getLogs, getLogStats } from '../controllers/logController.js';

const router = express.Router();

router.get('/', getLogs);
router.get('/stats', getLogStats);

export default router;