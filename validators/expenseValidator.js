const { body } = require('express-validator');

const expenseValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters long'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date format (YYYY-MM-DD)'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Description must be between 3 and 200 characters long'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['Cash', 'UPI', 'Card'])
    .withMessage('Payment method must be one of: Cash, UPI, Card'),
];

module.exports = {
  expenseValidator,
};
