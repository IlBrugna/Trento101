import express from 'express';
import {
    postPoll,
    getPolls,
    postVote,
    getDownloadPolls,
    putPoll
} from '../controllers/pollsController.js'; 
import { ipMiddleware } from '../middleware/ipMiddleware.js';

const router = express.Router(); //CREA ROUTER

router.post('/',postPoll);
router.post('/:pollId/votes', ipMiddleware, postVote);
router.get('',getPolls);
router.get('/downloads', getDownloadPolls);
router.put('/:pollId',putPoll);

export default router;