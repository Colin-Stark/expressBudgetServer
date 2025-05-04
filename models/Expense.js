const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please specify expense name'],
        trim: true
    },
    budgetedAmount: {
        type: Number,
        required: [true, 'Please specify a budgeted amount'],
        min: [0, 'Budgeted amount cannot be negative']
    },
    actualAmount: {
        type: Number,
        default: 0,
        min: [0, 'Actual amount cannot be negative']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    category: {
        type: String,
        required: [true, 'Please specify category'],
        trim: true
    },
    expectedPurchaseDate: {
        type: Date,
        required: [true, 'Please specify the expected purchase date']
    },
    actualPurchaseDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Partial'],
        default: 'Unpaid'
    },
    recurring: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        trim: true
    },
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);