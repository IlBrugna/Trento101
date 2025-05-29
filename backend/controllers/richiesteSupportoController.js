import supportRequestModel from '../models/richiesteSupportoModel.js';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer';
import { sendMail } from '../utils/mailUtils.js';
import { recordEvent} from "../utils/recordEventUtils.js";

export const getAllSupportRequests = async (req, res) => {
  try {
    const allRequests = await supportRequestModel.find();
    return res.status(200).json(allRequests);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore durante il recupero delle richieste di supporto' });
  }
};

export const getSupportRequest = async (req, res) => {
  const { supportRequestID } = req.params;

  if (!Types.ObjectId.isValid(supportRequestID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const request = await supportRequestModel.findById(supportRequestID);
    if (!request) {
      return res.status(404).json({ message: 'Richiesta di supporto non trovata' });
    }
    return res.status(200).json(request);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore durante il recupero della richiesta di supporto' });
  }
};

export const postSupportRequest = async (req, res) => {
  try {
    const requestData = req.body;

    const newRequest = new supportRequestModel(requestData);
    await newRequest.save();
    await recordEvent(req, 'support_request_created', { requestId: newRequest._id });
    return res.status(201).json(newRequest);
  } catch (err) {
    console.error('Error creating support request:', err);
    return res
      .status(500)
      .json({ message: 'Errore durante la creazione della richiesta di supporto' });
  }
};

export const putSupportRequest = async (req, res) => {
  const { supportRequestID } = req.params;

  if (!Types.ObjectId.isValid(supportRequestID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const updated = await supportRequestModel.findByIdAndUpdate(
      supportRequestID,
      req.body,
      { new: true, // restituisce il documento aggiornato
        runValidators: true // applica le validazioni dello schema
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Richiesta di supporto non trovata' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore durante la modifica della richiesta di supporto' });
  }
};

export const deleteSupportRequest = async (req, res) => {
  const { supportRequestID } = req.params;

  if (!Types.ObjectId.isValid(supportRequestID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const deleted = await supportRequestModel.findByIdAndDelete(supportRequestID);
    if (!deleted) {
      return res.status(404).json({ message: 'Richiesta di supporto non trovata' });
    }
    return res.status(200).json({ deleted });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Errore durante l'eliminazione della richiesta di supporto" });
  }
};

export async function replyToRequest(req, res, next) {
  try {
    const { supportRequestID } = req.params; 
    const { to, subject, message } = req.body;

    if (!Types.ObjectId.isValid(supportRequestID)) {
      return res.status(400).json({ error: 'ID non valido' });
    }
    const ticket = await supportRequestModel.findById(supportRequestID);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket non trovato' });
    }

    // Invia l'email
    const info = await sendMail({ to, subject, html: message });

    // Aggiorna il ticket
    ticket.status      = 'in_corso';
    ticket.lastReplyAt = new Date();
    await ticket.save();
    res.json({
      ok: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl?.(info),
    });
    await recordEvent(req, 'support_request_replied', { requestId: ticket._id });
  } catch (err) {
    console.error('Errore: ', err);
    next(err);
  }
}