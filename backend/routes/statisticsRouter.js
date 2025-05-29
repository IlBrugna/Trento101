import express from 'express';
import {
  getOverview,
  getTopPages,
  getEventBreakdown,
  getCompanyStats,
  getServiceStats,
  trackServiceClick,
  trackUniversitaServiceClick
} from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/top-pages', getTopPages);
router.get('/event-breakdown', getEventBreakdown);
router.get('/companies', getCompanyStats);
router.get('/services', getServiceStats);
router.post('/track-service-click', trackServiceClick);
router.post('/track-universita-service-click', trackUniversitaServiceClick);

export default router;
