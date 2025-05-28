const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Budget = require('../models/Budget');

// @desc    Create income
// @route   POST /api/incomes
// @access  Public (would be Private in real app)
router.post('/', async (req, res) => {
    try {
        const income = await Income.create(req.body);

        // Update the budget's totalIncome and balanceProjected
        const budget = await Budget.findById(income.budget);
        if (budget) {
            budget.totalIncome += income.amount;
            budget.balanceProjected = budget.totalIncome - budget.totalBudgetedExpenses;
            if (income.received) {
                budget.balanceActual += income.amount;
            }
            await budget.save();
        }

        res.status(201).json({ success: true, data: income });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get all incomes
// @route   GET /api/incomes
// @access  Public (would be Private in real app)
router.get('/', async (req, res) => {
    try {
        const query = {};

        // Filter by budget if budgetId is provided
        if (req.query.budgetId) {
            query.budget = req.query.budgetId;
        }

        const incomes = await Income.find(query);
        res.status(200).json({ success: true, count: incomes.length, data: incomes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get single income
// @route   GET /api/incomes/:id
// @access  Public (would be Private in real app)
router.get('/:id', async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ success: false, message: 'Income not found' });
        }

        res.status(200).json({ success: true, data: income });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Public (would be Private in real app)
router.put('/:id', async (req, res) => {
    try {
        // Get original income to calculate difference
        const originalIncome = await Income.findById(req.params.id);
        if (!originalIncome) {
            return res.status(404).json({ success: false, message: 'Income not found' });
        }

        // Update income
        const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Update budget's totalIncome and balanceProjected
        if (originalIncome.amount !== req.body.amount || originalIncome.received !== req.body.received) {
            const budget = await Budget.findById(income.budget);
            if (budget) {
                // Adjust budget's totalIncome
                budget.totalIncome = budget.totalIncome - originalIncome.amount + income.amount;
                budget.balanceProjected = budget.totalIncome - budget.totalBudgetedExpenses;

                // Handle received status changes
                if (originalIncome.received && !req.body.received) {
                    // Income was marked as received but now isn't
                    budget.balanceActual -= originalIncome.amount;
                } else if (!originalIncome.received && req.body.received) {
                    // Income wasn't received but now is
                    budget.balanceActual += income.amount;
                } else if (originalIncome.received && req.body.received && originalIncome.amount !== req.body.amount) {
                    // Income was and still is received, but amount changed
                    budget.balanceActual = budget.balanceActual - originalIncome.amount + income.amount;
                }

                await budget.save();
            }
        }

        res.status(200).json({ success: true, data: income });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Public (would be Private in real app)
router.delete('/:id', async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ success: false, message: 'Income not found' });
        }

        // Update budget's totalIncome and balanceProjected
        const budget = await Budget.findById(income.budget);
        if (budget) {
            budget.totalIncome -= income.amount;
            budget.balanceProjected = budget.totalIncome - budget.totalBudgetedExpenses;
            if (income.received) {
                budget.balanceActual -= income.amount;
            }
            await budget.save();
        }

        await income.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;