const express = require('express');
const router = express.Router();
const Savings = require('../models/Savings');

// @desc    Create savings goal
// @route   POST /api/savings
// @access  Public (would be Private in real app)
router.post('/', async (req, res) => {
    try {
        const savings = await Savings.create(req.body);
        res.status(201).json({ success: true, data: savings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get all savings
// @route   GET /api/savings
// @access  Public (would be Private in real app)
router.get('/', async (req, res) => {
    try {
        let query = {};

        // Filter by budget if budgetId is provided
        if (req.query.budgetId) {
            query.budget = req.query.budgetId;
        }

        const savings = await Savings.find(query);
        res.status(200).json({ success: true, count: savings.length, data: savings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get single savings goal
// @route   GET /api/savings/:id
// @access  Public (would be Private in real app)
router.get('/:id', async (req, res) => {
    try {
        const savings = await Savings.findById(req.params.id);

        if (!savings) {
            return res.status(404).json({ success: false, message: 'Savings goal not found' });
        }

        res.status(200).json({ success: true, data: savings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Update savings goal
// @route   PUT /api/savings/:id
// @access  Public (would be Private in real app)
router.put('/:id', async (req, res) => {
    try {
        const savings = await Savings.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!savings) {
            return res.status(404).json({ success: false, message: 'Savings goal not found' });
        }

        // The pre-save hook will recalculate the progress percentage

        res.status(200).json({ success: true, data: savings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Delete savings goal
// @route   DELETE /api/savings/:id
// @access  Public (would be Private in real app)
router.delete('/:id', async (req, res) => {
    try {
        const savings = await Savings.findById(req.params.id);

        if (!savings) {
            return res.status(404).json({ success: false, message: 'Savings goal not found' });
        }

        await savings.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;