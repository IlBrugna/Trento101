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
