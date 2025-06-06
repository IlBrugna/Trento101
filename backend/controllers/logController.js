import logModel from '../models/logModel.js';

export const getLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      status,
      startDate,
      endDate
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (action) filter.action = { $regex: action, $options: 'i' };
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [logs, total] = await Promise.all([
      logModel
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .populate('userEmail', { strictPopulate: false })
        .lean(),
      logModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalLogs: total,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei log' });
  }
};

export const getLogStats = async (req, res) => {
  try {
    const stats = await logModel.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastOccurrence: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const statusStats = await logModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayCount = await logModel.countDocuments({
      timestamp: { $gte: todayStart }
    });

    res.json({
      topActions: stats,
      statusBreakdown: statusStats,
      todayCount
    });
  } catch (error) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle statistiche' });
  }
};