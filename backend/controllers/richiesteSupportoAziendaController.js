import supportRequestAziendaModel from '../models/richiesteSupportoAziendaModel.js';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer';
import { sendMail } from '../utils/mailUtils.js';

export const getAllSupportRequestsAzienda = async (req, res) => {
  try {
    const allRequests = await supportRequestAziendaModel.find();
    return res.status(200).json(allRequests);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante il recupero delle richieste di supporto azienda' });
  }
};

export const getSupportRequestAzienda = async (req, res) => {
  const { supportRequestID } = req.params;

  if (!Types.ObjectId.isValid(supportRequestID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const request = await supportRequestAziendaModel.findById(supportRequestID);
    if (!request) {
      return res.status(404).json({ message: 'Richiesta non trovata' });
    }
    return res.status(200).json(request);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante il recupero della richiesta' });
  }
};

export const postSupportRequestAzienda = async (req, res) => {
  try {
    const requestData = req.body;
    const newRequest = new supportRequestAziendaModel(requestData);
    await newRequest.save();

    return res.status(201).json(newRequest);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante la creazione della richiesta' });
  }
};


export const putSupportRequestAzienda = async (req, res) => {
  const { supportRequestID } = req.params;

  if (!Types.ObjectId.isValid(supportRequestID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const updated = await supportRequestAziendaModel.findByIdAndUpdate(
      supportRequestID,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Richiesta non trovata' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante la modifica' });
  }
};

export const deleteSupportRequestAzienda = async (req, res) => {
  const { supportRequestID } = req.params;

  if (!Types.ObjectId.isValid(supportRequestID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const deleted = await supportRequestAziendaModel.findByIdAndDelete(supportRequestID);
    if (!deleted) {
      return res.status(404).json({ message: 'Richiesta non trovata' });
    }
    return res.status(200).json({ deleted });
  } catch (err) {
    return res.status(500).json({ message: "Errore durante l'eliminazione" });
  }
};

export async function replyToRequestAzienda(req, res, next) {
  try {
    const { supportRequestID } = req.params;
    const { to, subject, message } = req.body;

    if (!Types.ObjectId.isValid(supportRequestID)) {
      return res.status(400).json({ error: 'ID non valido' });
    }

    const ticket = await supportRequestAziendaModel.findById(supportRequestID);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket non trovato' });
    }

    const info = await sendMail({ to, subject, html: message });

    ticket.status = 'in_corso';
    ticket.lastReplyAt = new Date();
    await ticket.save();

    res.json({
      ok: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl?.(info),
    });
  } catch (err) {
    console.error('Errore: ', err);
    next(err);
  }
}
