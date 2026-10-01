const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title for this income source'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the income amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    category: {
      type: String,
      required: [true, 'Please select or specify a category'],
      default: 'Salary',
    },
    date: {
      type: Date,
      required: [true, 'Please provide the transaction date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'UPI', 'PayPal', 'Other'],
      default: 'Bank Transfer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Income', incomeSchema);
