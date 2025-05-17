import express from 'express';
import {
    getAllNews,
    getSpecificNews
} from '../controllers/newsController.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:newsID', getSpecificNews);

export default router;
