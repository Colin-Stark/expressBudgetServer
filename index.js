const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route files
const userRoutes = require('./routes/users');
const budgetRoutes = require('./routes/budgets');
const incomeRoutes = require('./routes/incomes');
const expenseRoutes = require('./routes/expenses');
const savingsRoutes = require('./routes/savings');

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/savings', savingsRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Budget API is running');
});

const PORT = process.env.PORT || 5000;

// First connect to the database, then start the server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}, Go to http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`Failed to start server: ${error.message}`);
    }
};

startServer();