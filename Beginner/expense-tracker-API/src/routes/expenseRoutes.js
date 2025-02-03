const express = require('express');
const { getExpenses, addExpense } = require('../controllers/expenseController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getExpenses);
router.post('/', protect, addExpense);

module.exports = router;
