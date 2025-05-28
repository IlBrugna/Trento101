import express from 'express';
import {
    postPoll,
    getPolls,
    postVote,
    putPoll
} from '../controllers/pollsController.js'; 
import { ipMiddleware } from '../middleware/ipMiddleware.js';

const router = express.Router(); //CREA ROUTER

router.post('/',postPoll);
router.get('',getPolls);
router.post('/:pollId/vote',ipMiddleware ,postVote);
router.put('/:pollId',putPoll);
export default router;