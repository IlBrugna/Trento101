// controllers/newsController.js
import newsModel from '../models/newsModel.js';   // importa il modello “notice”
import { Types } from 'mongoose';

// GET /news --> tutte le news
export const getAllNews = async (req, res) => {
  // Lista completa delle news
  try {
    const allNews = await newsModel.find(); // nessun filtro
    return res.status(200).json(allNews);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore nel recupero delle news' });
  }
};

// GET /news:newsID --> news specifica
export const getSpecificNews = async (req, res) => {
  const { newsID } = req.params;

  // controlla che l'id fornito sia un ObjectId valido
  if (!Types.ObjectId.isValid(newsID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const news = await newsModel.findById(newsID);
    if (!news) {
      return res.status(404).json({ message: 'News non trovata' });
    }
    return res.status(200).json(news);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore nel recupero della news' });
  }
};