const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Create expense
// @route   POST /api/expenses
// @access  Public (would be Private in real app)
router.post('/', async (req, res) => {
    try {
        const expense = await Expense.create(req.body);

        // Update the budget's totalBudgetedExpenses and balanceProjected
        const budget = await Budget.findById(expense.budget);
        if (budget) {
            budget.totalBudgetedExpenses += expense.budgetedAmount;
            budget.balanceProjected = budget.totalIncome - budget.totalBudgetedExpenses;

            // If expense is already paid, update actual expenses and balance
            if (expense.status === 'Paid') {
                budget.totalActualExpenses += expense.actualAmount;
                budget.balanceActual -= expense.actualAmount;
            } else if (expense.status === 'Partial') {
                budget.totalActualExpenses += expense.actualAmount;
                budget.balanceActual -= expense.actualAmount;
            }

            await budget.save();
        }

        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public (would be Private in real app)
router.get('/', async (req, res) => {
    try {
        let query = {};

        // Filter by budget if budgetId is provided
        if (req.query.budgetId) {
            query.budget = req.query.budgetId;
        }

        // Filter by category if it's provided
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by status if it's provided
        if (req.query.status) {
            query.status = req.query.status;
        }

        const expenses = await Expense.find(query);
        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public (would be Private in real app)
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public (would be Private in real app)
router.put('/:id', async (req, res) => {
    try {
        // Get original expense to calculate difference
        const originalExpense = await Expense.findById(req.params.id);
        if (!originalExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Update expense
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Update budget's totalBudgetedExpenses, totalActualExpenses, balanceProjected, and balanceActual
        const budget = await Budget.findById(expense.budget);
        if (budget) {
            // Adjust budget's totalBudgetedExpenses
            if (originalExpense.budgetedAmount !== expense.budgetedAmount) {
                budget.totalBudgetedExpenses = budget.totalBudgetedExpenses - originalExpense.budgetedAmount + expense.budgetedAmount;
                budget.balanceProjected = budget.totalIncome - budget.totalBudgetedExpenses;
            }

            // Handle status changes
            if (originalExpense.status !== expense.status || originalExpense.actualAmount !== expense.actualAmount) {
                // Deduct original actual expense if it was Paid or Partial
                if (originalExpense.status === 'Paid' || originalExpense.status === 'Partial') {
                    budget.totalActualExpenses -= originalExpense.actualAmount;
                    budget.balanceActual += originalExpense.actualAmount;
                }

                // Add new actual expense if it's Paid or Partial
                if (expense.status === 'Paid' || expense.status === 'Partial') {
                    budget.totalActualExpenses += expense.actualAmount;
                    budget.balanceActual -= expense.actualAmount;
                }
            }

            await budget.save();
        }

        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public (would be Private in real app)
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Update budget's totalBudgetedExpenses and balanceProjected
        const budget = await Budget.findById(expense.budget);
        if (budget) {
            budget.totalBudgetedExpenses -= expense.budgetedAmount;
            budget.balanceProjected = budget.totalIncome - budget.totalBudgetedExpenses;

            // If expense was paid or partial, update actual expenses and balance
            if (expense.status === 'Paid' || expense.status === 'Partial') {
                budget.totalActualExpenses -= expense.actualAmount;
                budget.balanceActual += expense.actualAmount;
            }

            await budget.save();
        }

        await expense.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;