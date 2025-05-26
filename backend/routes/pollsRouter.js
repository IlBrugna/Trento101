import express from 'express';
import {
    postPoll,
    getPolls
} from '../controllers/pollsController.js'; 

const router = express.Router(); //CREA ROUTER

router.post('/',postPoll);
router.get('',getPolls);

export default router;