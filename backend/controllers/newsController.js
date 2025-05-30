import newsModel from '../models/newsModel.js';   // importa il modello “News”
import { Types } from 'mongoose';
import { recordEvent } from '../utils/recordEventUtils.js'; // importa la funzione per registrare gli eventi

export const getAllNews = async (req, res) => {
  // Lista completa delle news
  try {
    const allNews = await newsModel.find(); // nessun filtro
    return res.status(200).json(allNews);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore durante il recupero delle notizie' });
  }
};


export const getNews = async (req, res) => {
  const { newsID } = req.params;

  // controlla che l'id fornito sia un ObjectId valido
  if (!Types.ObjectId.isValid(newsID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const news = await newsModel.findById(newsID);
    if (!news) {
      return res.status(404).json({ message: 'Notizia non trovata' });
    }
    return res.status(200).json(news);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Errore durante il recupero della notizia' });
  }
};

export const postNews = async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new newsModel(newsData);

    await newNews.save();
    return res.status(201).json(newNews);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante la creazione della notizia' });
  }
};

export const putNews = async (req, res) => {
  const { newsID } = req.params;

  if (!Types.ObjectId.isValid(newsID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const updated = await newsModel.findByIdAndUpdate(newsID, req.body, {
      new: true,          // restituisce il documento aggiornato
      runValidators: true // applica le validazioni dello schema
    });

    if (!updated) {
      return res.status(404).json({ message: 'Notizia non trovata' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Errore durante la modifica della notizia' });
  }
};

export const deleteNews = async (req, res) => {
  const { newsID } = req.params;

  if (!Types.ObjectId.isValid(newsID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const deleted = await newsModel.findByIdAndDelete(newsID);
    if (!deleted) {
      return res.status(404).json({ message: 'Notizia non trovata' });
    }
    return res.status(200).json({ deleted });
  } catch (err) {
    return res.status(500).json({ message: "Errore durante l\'eleminazione della notizia" });
  }
};
