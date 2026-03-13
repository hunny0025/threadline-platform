const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'User registered' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'User logged in' });
});

module.exports = router;