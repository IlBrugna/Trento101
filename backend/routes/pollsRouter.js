import express from 'express';
import {
    postPoll
} from '../controllers/pollsController.js'; 

const router = express.Router(); //CREA ROUTER

router.post('/',postPoll);

export default router;