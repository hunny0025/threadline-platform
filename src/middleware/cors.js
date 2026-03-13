const cors = require('cors');
const { allowedOrigins } = require('../config');

module.exports = cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});