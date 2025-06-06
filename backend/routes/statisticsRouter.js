import express from 'express';
import {
  getOverview,
  getTopPages,
  getEventBreakdown,
  getCompanyStats,
  getServiceStats,
  trackComuneServiceClick,
  trackUniversitaServiceClick
} from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/top-pages', getTopPages);
router.get('/event-breakdown', getEventBreakdown);
router.get('/companies', getCompanyStats);
router.get('/services', getServiceStats);
router.post('/comune-service-click', trackComuneServiceClick);
router.post('/universita-service-click', trackUniversitaServiceClick);

export default router;
