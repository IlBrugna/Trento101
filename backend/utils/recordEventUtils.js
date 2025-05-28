import Event from '../models/statisticsModel.js';

/**
 * Salva un evento di statistica nel DB.
 *
 * @param {Object} req   – l’oggetto Request di Express
 * @param {String} type  – uno dei valori ammessi nel modello (login, logout, etc)
 * @param {Object} extra – campi opzionali da aggiungere (url, status, etc)
 */
export async function recordEvent(req, type, extra = {}) {
  try {
    await Event.log({
      type,
      url: req.originalUrl,
      ...extra,
    });
  } catch (err) {
    console.error('[EVENT-LOG] ', err.message);
  }
}
