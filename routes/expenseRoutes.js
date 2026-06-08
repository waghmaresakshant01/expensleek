const express = require('express');
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getExpenseStats,
  deleteAllExpenses,
} = require('../controllers/expenseController');

const { expenseValidator } = require('../validators/expenseValidator');
const validate = require('../middleware/validationMiddleware');

// Analytics and statistical summaries (defined before :id to prevent collision)
router.get('/stats', getExpenseStats);

// Filter by category path param
router.get('/category/:category', getExpensesByCategory);

// Core CRUD Endpoints
router.route('/')
  .get(getExpenses)
  .post(expenseValidator, validate, createExpense)
  .delete(deleteAllExpenses);

router.route('/:id')
  .get(getExpenseById)
  .put(expenseValidator, validate, updateExpense)
  .delete(deleteExpense);

module.exports = router;
