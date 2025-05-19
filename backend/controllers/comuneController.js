// controllers/comuneController.js
import comuneModel from '../models/comuneModel.js'; // importa il modello
import { Types } from 'mongoose';

// GET /comune --> tutti i servizi
export const getServiziComune = async (req, res) => {
  const { title } = req.query;
  if (title) {
    try {
      const service = await comuneModel.findOne({ title });
      return res.status(200).json({ exists: !!service });
    } catch (err) {
      return res.status(500).json({ message: 'Errore nella ricerca del servizio' });
    }
  }

  // lista completa di tutti i servizi
  try {
    const services = await comuneModel.find();   // nessun filtro = tutti i documenti
    return res.status(200).json(services);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante il recupero dei servizi' });
  }
};

// GET /comune:serviceID --> servizio specifico
export const getServizioComune = async (req, res) => {
  const { serviceID } = req.params;

  // controlla che l'id fornito sia un ObjectId valido di Mongo
  if (!Types.ObjectId.isValid(serviceID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const service = await comuneModel.findById(serviceID);
    if (!service) {
      return res.status(404).json({ message: 'Servizio non trovato' });
    }
    return res.status(200).json(service);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante il recupero del servizio' });
  }
};

// POST /comune/createservice --> inserimento di un nuovo servizio
export const postServizioComune = async (req, res) => {
  try {
    const serviceData = req.body;

    const newService = new comuneModel(serviceData);

    await newService.save();              // inserisci in MongoDB
    return res.status(201).json(newService);
  } catch (err) {
    return res.status(500).json({ message: "Errore durante la creazione del servizio" });
  }
};

// PUT /comune/:serviceID --> modifica un servizio esistente
export const putServizioComune = async (req, res) => {
  const { serviceID } = req.params;

  if (!Types.ObjectId.isValid(serviceID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const updated = await comuneModel.findByIdAndUpdate(
      serviceID,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Servizio non trovato' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante la modifica del servizio' });
  }
};

// DELETE /comune/:serviceID --> elimina un servizio
export const deleteServizioComune = async (req, res) => {
  const { serviceID } = req.params;

  if (!Types.ObjectId.isValid(serviceID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const deleted = await comuneModel.findByIdAndDelete(serviceID);
    if (!deleted) {
      return res.status(404).json({ message: 'Servizio non trovato' });
    }
    return res.status(200).json({ deleted });
  } catch (err) {
    return res.status(500).json({ message: "Errore durante l\'eleminazione del servizio" });
  }
};
