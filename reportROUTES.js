const express = require('express');
const router = express.Router();
const {
  getMonthlyReport,
  getYearlyReport,
  getCategoryPieReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/monthly', protect, getMonthlyReport);
router.get('/yearly', protect, getYearlyReport);
router.get('/category-pie', protect, getCategoryPieReport);

module.exports = router;
