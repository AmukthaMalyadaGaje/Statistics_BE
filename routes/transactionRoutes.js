const express = require('express');
const controller = require('../controllers/transactionController');
const router = express.Router();

router.get('/initialize', controller.initializeDatabase);
router.get('/transactions', controller.getTransactions);
router.get('/statistics', controller.getStatistics);
router.get('/bar-chart', controller.getBarChart);
router.get('/pie-chart', controller.getPieChart);

module.exports = router;
