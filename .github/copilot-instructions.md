## Project Overview

This is an Express.js server for a budget application, providing RESTful APIs for managing users, budgets, expenses, incomes, and savings. The server uses MongoDB as its database with Mongoose for object modeling.

## Development Flow

### Setup and Installation

1. **Clone Repository**: git clone https://github.com/Colin-Stark/expressBudgetServer.git
2. **Install Dependencies**: npm install


### Development Commands

- **Start Server**: npm run start (uses Node''s watch mode for auto-reloading)
- **Run Tests**: npm test
- **Run Tests in Watch Mode**: npm run test:watch

## Repository Structure

```
fabudget/expressBudgetServer/
├── config/
│   └── db.js                     # MongoDB connection configuration
├── models/
│   ├── Budget.js                 # Budget model schema and methods
│   ├── Expense.js                # Expense model schema and methods
│   ├── Income.js                 # Income model schema and methods
│   ├── Savings.js                # Savings model schema and methods
│   ├── User.js                   # User model schema, authentication methods
│   └── readme.md                 # Documentation for models
├── routes/
│   ├── budgets.js                # Budget CRUD API routes
│   ├── expenses.js               # Expense CRUD API routes
│   ├── incomes.js                # Income CRUD API routes
│   ├── savings.js                # Savings CRUD API routes
│   └── users.js                  # User registration, authentication routes
├── tests/
│   └── user.test.js              # User routes tests
├── .github/
│   └── copilot-instructions.md   # This file - instructions for GitHub Copilot
├── coverage/                     # Test coverage reports
├── index.js                      # Main application entry point
├── jest.config.js                # Jest testing framework configuration
├── package.json                  # Project dependencies and scripts
└── README.md                     # Project documentation
```

## API Structure

### User Management

- POST /api/users/register - Register new user
- POST /api/users/login - User login
- GET /api/users - Get all users (admin only in production)

### Budget Management

- POST /api/budgets - Create budget
- GET /api/budgets - Get all budgets
- GET /api/budgets/:id - Get budget by ID
- PUT /api/budgets/:id - Update budget
- DELETE /api/budgets/:id - Delete budget

### Expense Management

- POST /api/expenses - Create expense
- GET /api/expenses - Get all expenses (supports filtering)
- GET /api/expenses/:id - Get expense by ID
- PUT /api/expenses/:id - Update expense
- DELETE /api/expenses/:id - Delete expense

### Income Management

- POST /api/incomes - Create income
- GET /api/incomes - Get all incomes (supports filtering)
- GET /api/incomes/:id - Get income by ID
- PUT /api/incomes/:id - Update income
- DELETE /api/incomes/:id - Delete income

### Savings Management

- POST /api/savings - Create savings goal
- GET /api/savings - Get all savings goals
- GET /api/savings/:id - Get savings goal by ID
- PUT /api/savings/:id - Update savings goal
- DELETE /api/savings/:id - Delete savings goal

## Code Style and Standards

- RESTful API design principles
- Consistent error handling across routes (success/error pattern)
- Data validation using Mongoose schema validation
- Asynchronous programming using async/await
- Standard HTTP status codes for responses' > "c:\Users\rirr0\Desktop\fabudget\expressBudgetServer\.github\copilot-instructions.md
