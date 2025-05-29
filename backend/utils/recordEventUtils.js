import Statistics from '../models/statisticsModel.js';

export async function recordEvent(req, type, extra = {}) {
  try {
    const url = req.originalUrl;
    const serviceId = extra.metadata?.serviceId;
    
    await Statistics.incrementCounter(type, url, serviceId);
  } catch (err) {
    console.error('[EVENT-LOG] ', err.message);
  }
}