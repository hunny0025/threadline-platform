

import { Router } from 'express';
import { logEvent, getAnalyticsSummary } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

 
router.post(
  '/events',
  rateLimiter({ windowMs: 60 * 1000, max: 60 }), // 60 events / minute / IP
  logEvent
);


router.get(
  '/summary',
  authenticate,
  authorize(['admin']),
  getAnalyticsSummary
);

export default router;
