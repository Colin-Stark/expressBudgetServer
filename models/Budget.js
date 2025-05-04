const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: [true, 'Please specify the month (1-12)'],
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: [true, 'Please specify the year'],
        min: 2020
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for this budget'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalIncome: {
        type: Number,
        default: 0
    },
    totalBudgetedExpenses: {
        type: Number,
        default: 0
    },
    totalActualExpenses: {
        type: Number,
        default: 0
    },
    balanceProjected: {
        type: Number,
        default: 0
    },
    balanceActual: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual fields for related data
BudgetSchema.virtual('incomes', {
    ref: 'Income',
    localField: '_id',
    foreignField: 'budget',
    justOne: false
});

BudgetSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'budget',
    justOne: false
});

BudgetSchema.virtual('savings', {
    ref: 'Savings',
    localField: '_id',
    foreignField: 'budget',
    justOne: false
});

// Index for faster querying by month and year
BudgetSchema.index({ month: 1, year: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);