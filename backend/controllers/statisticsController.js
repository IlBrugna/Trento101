import Event from '../models/statisticsModel.js';
import ms    from 'ms';
import { recordEvent } from '../utils/recordEventUtils.js';

function parseRange(range = '30d') {
  // "7d" || "30d" || "90d"
  const millis = ms(range);
  if (!millis) throw new Error('range non valido');
  return new Date(Date.now() - millis);
}

// /stats/overview
export async function getOverview(req, res) {
  try {
    const from = parseRange(req.query.range);
    const data = await Event.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: {
          _id:  { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
          visits:           { $sum: { $cond: [{ $eq: ['$type', 'page_view']                }, 1, 0] } },
          logins:           { $sum: { $cond: [{ $eq: ['$type', 'login']                    }, 1, 0] } },
          supportRequests:  { $sum: { $cond: [{ $eq: ['$type', 'support_request_created']  }, 1, 0] } },
        }},
      { $sort: { '_id.day': 1 } },
      { $project: { day: '$_id.day', visits: 1, logins: 1, supportRequests: 1, _id: 0 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// /stats/top-pages
export async function getTopPages(req, res) {
  const limit = parseInt(req.query.limit ?? 10, 10);
  const data  = await Event.aggregate([
    { $match: { type: 'page_view' } },
    { $group: { _id: '$url', views: { $sum: 1 } } },
    { $sort:  { views: -1 } },
    { $limit: limit }
  ]);
  res.json(data);
}

// /stats/event-breakdown
export async function getEventBreakdown(req, res) {
  try {
    const from = parseRange(req.query.range);
    const data = await Event.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// /stats/companies
export async function getCompanyStats(req, res) {
  try {
    const data = await Event.aggregate([
      { $match: { type: { $in: ['company_created', 'company_updated', 'company_deleted'] } } },
      { $group: { 
          _id: '$type', 
          count: { $sum: 1 } 
        }},
      { $project: { 
          type: '$_id', 
          count: 1, 
          _id: 0 
        }},
      { $sort: { count: -1 } }
    ]);
    // Conto il totale delle aziende create
    const totalCompanies = await Event.aggregate([
      { $match: { type: 'company_created' } },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);

    const result = {
      events: data,
      totalCompanies: totalCompanies.length > 0 ? totalCompanies[0].total : 0
    };

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// /stats/services
export async function getServiceStats(req, res) {
  try {
    const from = parseRange(req.query.range);

    const topServices = await Event.aggregate([
      { $match: {
          type: 'service_click',
          createdAt: { $gte: from },
        }
      },
      { $group: {
          _id        : '$metadata.serviceId',
          clicks     : { $sum: 1 },
          serviceName: { $first: '$metadata.serviceName' }
        }
      },
      { $project: {
          serviceId  : '$_id',
          serviceName: 1,
          clicks     : 1,
          _id        : 0
        }
      },
      { $sort : { clicks: -1 } },
      { $limit: 10 }
    ]);

    const serviceEvents = await Event.aggregate([
      { $match: {
          type     : { $in: [
            'comune_service_created',
            'comune_service_updated',
            'comune_service_deleted'
          ]},
          createdAt: { $gte: from }
        }
      },
      { $group: {
          _id  : '$type',
          count: { $sum: 1 }
        }
      },
      { $project: { type: '$_id', count: 1, _id: 0 } },
      { $sort : { count: -1 } }
    ]);

    res.json({ topServices, serviceEvents });
  } catch (err) {
    console.error('Error in getServiceStats:', err);
    res.status(400).json({ message: err.message });
  }
}

// /stats/track-service-click
export async function trackServiceClick(req, res) {
  try {
    const { serviceId, serviceName, serviceUrl, isPrimary } = req.body;
    if (!serviceId || !serviceName) {
      return res.status(400).json({ message: 'serviceId and serviceName are required' });
    }

    await recordEvent(req, 'service_click', {
      metadata: {
        serviceId,
        serviceName,
        serviceUrl,
        isPrimary
      }
    });

    res.status(201).json({ message: 'Service click tracked successfully' });
  } catch (err) {
    console.error('Error tracking service click:', err);
    res.status(500).json({ message: 'Failed to track service click', error: err.message });
  }
}