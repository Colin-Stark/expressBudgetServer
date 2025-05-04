const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Public (would be Private in real app)
router.post('/', async (req, res) => {
    try {
        const budget = await Budget.create(req.body);
        res.status(201).json({ success: true, data: budget });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Budget already exists for this month and year' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Public (would be Private in real app)
router.get('/', async (req, res) => {
    try {
        // Filter by user if userId is provided
        const filter = {};
        if (req.query.userId) {
            filter.user = req.query.userId;
        }

        const budgets = await Budget.find(filter);
        res.status(200).json({ success: true, count: budgets.length, data: budgets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Public (would be Private in real app)
router.get('/:id', async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id)
            .populate('incomes')
            .populate('expenses')
            .populate('savings');

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }

        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Public (would be Private in real app)
router.put('/:id', async (req, res) => {
    try {
        const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }

        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Public (would be Private in real app)
router.delete('/:id', async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }

        await budget.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;