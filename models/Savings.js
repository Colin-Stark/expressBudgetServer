const mongoose = require('mongoose');

const SavingsSchema = new mongoose.Schema({
    targetAmount: {
        type: Number,
        required: [true, 'Please specify a savings target amount'],
        min: [0, 'Target amount cannot be negative']
    },
    actualAmount: {
        type: Number,
        default: 0,
        min: [0, 'Actual amount cannot be negative']
    },
    savingMethod: {
        type: String,
        required: [true, 'Please specify the saving method'],
        enum: ['Manual', 'Auto-deduction', 'Bank Transfer', 'Other'],
        default: 'Manual'
    },
    goal: {
        type: String,
        required: [true, 'Please specify the savings goal/purpose'],
        trim: true
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
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

// Calculate progress percentage before saving
SavingsSchema.pre('save', function (next) {
    if (this.targetAmount > 0) {
        this.progressPercentage = Math.min(100, (this.actualAmount / this.targetAmount) * 100);
    }
    next();
});

module.exports = mongoose.model('Savings', SavingsSchema);