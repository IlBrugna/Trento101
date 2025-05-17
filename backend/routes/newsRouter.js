import express from 'express';
import {
    getAllNews,
    getSpecificNews,
    createNews,
    updateNews,
    deleteNews
} from '../controllers/newsController.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:newsID', getSpecificNews);
router.post('/', createNews);
router.put('/:newsID', updateNews);
router.delete('/:newsID', deleteNews);

export default router;
