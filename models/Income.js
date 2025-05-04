const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Please specify income type (e.g., salary, gift, loan)'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please specify an amount'],
        min: [0, 'Amount cannot be negative']
    },
    source: {
        type: String,
        required: [true, 'Please specify the source of income'],
        trim: true
    },
    expectedDate: {
        type: Date,
        required: [true, 'Please specify the expected date of income']
    },
    receivedDate: {
        type: Date,
        default: null
    },
    weekOfArrival: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please specify the week of arrival (1-5)']
    },
    received: {
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

module.exports = mongoose.model('Income', IncomeSchema);