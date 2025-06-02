import express from 'express';
import {
    postPoll,
    getPolls,
    postVote,
    getDownloadPolls
} from '../controllers/pollsController.js'; 
import { ipMiddleware } from '../middleware/ipMiddleware.js';

const router = express.Router(); //CREA ROUTER

router.post('/',postPoll);
router.post('/:pollId/vote', ipMiddleware, postVote);
router.get('/',getPolls);
router.get('/download', getDownloadPolls);

export default router;