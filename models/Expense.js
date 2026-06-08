const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['Cash', 'UPI', 'Card'],
        message: 'Payment method must be either Cash, UPI, or Card',
      },
    },
    isSplit: {
      type: Boolean,
      default: false,
    },
    splitPeopleCount: {
      type: Number,
      default: 1,
    },
    splitPeopleNames: {
      type: [String],
      default: [],
    },
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index on description and category for advanced search query filtering
expenseSchema.index({ description: 'text', category: 'text' });

module.exports = mongoose.model('Expense', expenseSchema);
