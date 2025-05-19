import express from 'express';
import {
    getAllNews,
    getNews,
    postNews,
    putNews,
    deleteNews
} from '../controllers/newsController.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:newsID', getNews);
router.post('/', postNews);
router.put('/:newsID', putNews);
router.delete('/:newsID', deleteNews);

export default router;
