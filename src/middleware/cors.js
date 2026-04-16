const cors = require('cors');
const { allowedOrigins } = require('../config');

// Ensure allowedOrigins is an array and clean trailing slashes
let origins = Array.isArray(allowedOrigins) 
  ? allowedOrigins.map(origin => origin.trim().replace(/\/$/, ''))
  : [];

// Ensure Vercel frontend is always allowed as fallback
const vercelOrigin = 'https://threadline-platform.vercel.app';
if (!origins.includes(vercelOrigin)) {
  origins.push(vercelOrigin);
}

module.exports = cors({
  origin: origins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With',
    'x-session-id',
  ],
  exposedHeaders: ['x-session-id'],
  credentials: true,
});