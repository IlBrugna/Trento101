import supportRequestModel from '../models/richiesteSupportoModel.js';
import { Types } from 'mongoose';

export const postSupportRequest = async (req, res) => {
  try {
    const requestData = req.body;

    const newRequest = new supportRequestModel(requestData);
    await newRequest.save();

    return res.status(201).json(newRequest);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore durante la creazione della richiesta di supporto' });
  }
};