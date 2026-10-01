
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create schema for expenses
const TodoSchema = new Schema(
    {
        action: {
            type: String,
            required: [true, 'Expense description is required'],
            trim: true,
        },

        amount: {
            type: Number,
            required: [true, 'Expense amount is required'],
            min: [0, 'Amount cannot be negative'],
        },

        category: {
            type: String,
            required: [true, 'Expense category is required'],
            enum: [
                'Food',
                'Travel',
                'Shopping',
                'Bills',
                'Education',
                'Entertainment',
                'Health',
                'Other'
            ],
        },

        paymentMethod: {
            type: String,
            enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
            default: 'Cash',
        },

        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Create model for expense
const Todo = mongoose.model('todo', TodoSchema);

module.exports = Todo;

