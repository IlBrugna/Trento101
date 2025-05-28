import express from 'express';
import {getServiziUniversita} from '../controllers/serviziUniversitaController.js';

const router = express.Router();

router.get('/', getServiziUniversita);

export default router;