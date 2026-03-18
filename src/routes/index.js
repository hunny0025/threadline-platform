const express = require('express');
const router = express.Router();

router.use('/products', require('./products'));
router.use('/users', require('./users'));
router.use('/orders', require('./orders'));
router.use('/auth', require('./auth'));
import analyticsRouter from './analytics.js'; 
router.use('/analytics', analyticsRouter);          
module.exports = router;
