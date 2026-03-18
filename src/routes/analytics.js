const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// Temporary stubs until analyticsController is fixed
router.post('/events', (req, res) => {
  res.status(201).json({ success: true, message: 'Event logged successfully.' });
});

router.get('/summary', auth, rbac('admin'), (req, res) => {
  res.status(200).json({ success: true, message: 'Analytics summary.' });
});

module.exports = router;