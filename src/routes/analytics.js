const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { logEvent, getAnalyticsSummary } = require('../controllers/analyticsController');

router.post('/events', logEvent);
router.get('/summary', auth, rbac('admin'), getAnalyticsSummary);

module.exports = router;