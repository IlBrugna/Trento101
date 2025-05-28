import serviziUniversitaModel from '../models/serviziUniversitaModel.js'; 
import { Types } from 'mongoose';

export const getServiziUniversita = async (req, res) => {
  const { title } = req.query;

  // Se c'è una query "title", cerca un solo servizio
  if (title) {
    try {
      const service = await serviziUniversitaModel.findOne({ title });
      return res.status(200).json({ exists: !!service });
    } catch (err) {
      return res.status(500).json({ message: 'Errore nella ricerca del servizio' });
    }
  }

  // Altrimenti restituisci TUTTI i servizi
  try {
    const allServices = await serviziUniversitaModel.find({});
    return res.status(200).json(allServices);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante il recupero dei servizi universitari' });
  }
};

export const getServizioUniversita = async (req, res) => {
  const { serviceID } = req.params;

  if (!Types.ObjectId.isValid(serviceID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const service = await serviziUniversitaModel.findById(serviceID);
    if (!service) {
      return res.status(404).json({ message: 'Servizio non trovato' });
    }
    return res.status(200).json(service);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante il recupero del servizio' });
  }
};

export const postServizioUniversita = async (req, res) => {
  try {
    const serviceData = req.body;

    const newService = new serviziUniversitaModel(serviceData);

    await newService.save();             
    return res.status(201).json(newService);
  } catch (err) {
    return res.status(500).json({ message: "Errore durante la creazione del servizio" });
  }
};

export const putServizioUniversita = async (req, res) => {
  const { serviceID } = req.params;

  if (!Types.ObjectId.isValid(serviceID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const updated = await serviziUniversitaModel.findByIdAndUpdate(
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


export const deleteServizioUniversita = async (req, res) => {
  const { serviceID } = req.params;

  if (!Types.ObjectId.isValid(serviceID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const deleted = await serviziUniversitaModel.findByIdAndDelete(serviceID);
    if (!deleted) {
      return res.status(404).json({ message: 'Servizio non trovato' });
    }
    return res.status(200).json({ deleted });
  } catch (err) {
    return res.status(500).json({ message: "Errore durante l\'eleminazione del servizio" });
  }
};

