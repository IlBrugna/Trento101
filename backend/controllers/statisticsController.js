import Statistics from '../models/statisticsModel.js';

export async function getOverview(req, res) {
  try {
    const stats = await Statistics.findOne() || {};
    res.json({
      visits: stats.pageViews ? Array.from(stats.pageViews.values()).reduce((sum, count) => sum + count, 0) : 0,
      logins: stats.totalLogins || 0,
      supportRequests: stats.totalSupportRequests || 0
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getTopPages(req, res) {
  try {
    const limit = parseInt(req.query.limit ?? 10, 10);
    const stats = await Statistics.findOne();
   
    if (!stats || !stats.pageViews) {
      return res.json([]);
    }
   
    // Convert Map to array of [key, value] pairs
    const pages = Array.from(stats.pageViews)
      .map(([url, views]) => ({ _id: url, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
   
    res.json(pages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getEventBreakdown(req, res) {
  try {
    const stats = await Statistics.findOne() || {};
    
    const regularServiceClicks = stats.serviceClicks ? Array.from(stats.serviceClicks.values()).reduce((sum, count) => sum + count, 0) : 0;
    const universitaServiceClicks = stats.universitaServiceClicks ? Array.from(stats.universitaServiceClicks.values()).reduce((sum, count) => sum + count, 0) : 0;
    
    const breakdown = [
      { type: 'page_view', count: stats.pageViews ? Array.from(stats.pageViews.values()).reduce((sum, count) => sum + count, 0) : 0 },
      { type: 'login', count: stats.totalLogins || 0 },
      { type: 'logout', count: stats.totalLogouts || 0 },
      { type: 'support_request_created', count: stats.totalSupportRequests || 0 },
      { type: 'company_created', count: stats.totalCompaniesCreated || 0 },
      { type: 'survey_vote', count: stats.totalSurveyVotes || 0 },
      { type: 'service_click', count: regularServiceClicks + universitaServiceClicks }
    ].filter(item => item.count > 0);
   
    res.json(breakdown);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getCompanyStats(req, res) {
  try {
    const stats = await Statistics.findOne() || {};
    res.json({
      events: [{ type: 'company_created', count: stats.totalCompaniesCreated || 0 }],
      totalCompanies: stats.totalCompaniesCreated || 0
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getServiceStats(req, res) {
  try {
    const stats = await Statistics.findOne();
   
    let topServices = [];
    
    // Click regolari sui servizi
    if (stats && stats.serviceClicks) {
      const regularServices = Array.from(stats.serviceClicks)
        .map(([serviceName, clicks]) => ({
          serviceId: serviceName,
          clicks,
          serviceName: serviceName,
          type: 'regular'
        }));
      topServices = [...regularServices];
    }
    
    // Click sui servizi Università
    if (stats && stats.universitaServiceClicks) {
      const universitaServices = Array.from(stats.universitaServiceClicks)
        .map(([serviceName, clicks]) => ({
          serviceId: serviceName,
          clicks,
          serviceName: serviceName,
          type: 'universita'
        }));
      topServices = [...topServices, ...universitaServices];
    }
    
    // Filtra e ordina i servizi per numero di click
    topServices = topServices
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
   
    res.json({ topServices, serviceEvents: [] });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function trackComuneServiceClick(req, res) {
  try {
    const { serviceId, serviceName } = req.body;
    if (!serviceId) {
      return res.status(400).json({ message: 'serviceId is required' });
    }
    
    const keyToStore = serviceName || serviceId;
    await Statistics.incrementCounter('service_click', null, keyToStore);
    
    res.status(201).json({ message: 'Service click tracked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to track service click', error: err.message });
  }
}

export async function trackUniversitaServiceClick(req, res) {
  try {
    const { serviceId, serviceName } = req.body;
    if (!serviceId) {
      return res.status(400).json({ message: 'serviceId is required' });
    }
   
    const keyToStore = serviceName || serviceId;
    await Statistics.incrementCounter('universita_service_click', null, keyToStore);
   
    res.status(201).json({ message: 'University service click tracked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to track university service click', error: err.message });
  }
}