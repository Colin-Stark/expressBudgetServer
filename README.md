# Budget API

A RESTful API for a personal budgeting application built with Express.js and MongoDB. This API allows users to manage their monthly budgets, track income, expenses, and savings goals.

## Overview

This API serves as the backend for a Flutter budget management application, providing endpoints for user authentication, budget creation, and financial tracking. It's designed to help users maintain control of their finances by planning and monitoring their monthly budgets.

## Features

- User registration and authentication
- Monthly budget creation and management
- Income tracking with source, type, and expected dates
- Expense tracking with categories, priorities, and status
- Savings goals with progress tracking
- Automatic calculations for budget totals and balances

## API Structure

The API is organized into the following resources:

### Users

Manages user accounts and authentication.

### Budgets

The central resource representing monthly budgets with summary calculations.

### Incomes

Tracks expected and received income with detailed information.

### Expenses

Manages planned and actual expenses across various categories.

### Savings

Tracks savings goals and progress towards financial targets.

## API Endpoints

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Authenticate a user |
| GET | `/api/users` | Get all users (would be admin-only in production) |

### Budget Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/budgets` | Create a new budget |
| GET | `/api/budgets` | Get all budgets (filter by userId with query param) |
| GET | `/api/budgets/:id` | Get a single budget with all related data |
| PUT | `/api/budgets/:id` | Update a budget |
| DELETE | `/api/budgets/:id` | Delete a budget |

### Income Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/incomes` | Create a new income entry |
| GET | `/api/incomes` | Get all incomes (filter by budgetId with query param) |
| GET | `/api/incomes/:id` | Get a single income entry |
| PUT | `/api/incomes/:id` | Update an income entry |
| DELETE | `/api/incomes/:id` | Delete an income entry |

### Expense Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create a new expense |
| GET | `/api/expenses` | Get all expenses (filter by budgetId, category, status) |
| GET | `/api/expenses/:id` | Get a single expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

### Savings Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/savings` | Create a new savings goal |
| GET | `/api/savings` | Get all savings goals (filter by budgetId) |
| GET | `/api/savings/:id` | Get a single savings goal |
| PUT | `/api/savings/:id` | Update a savings goal |
| DELETE | `/api/savings/:id` | Delete a savings goal |

## Data Models

### User Model

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date
}
```

### Budget Model

```javascript
{
  month: Number (1-12),
  year: Number,
  title: String,
  user: ObjectId (Reference to User),
  totalIncome: Number,
  totalBudgetedExpenses: Number,
  totalActualExpenses: Number,
  balanceProjected: Number,
  balanceActual: Number,
  notes: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Income Model

```javascript
{
  type: String,
  amount: Number,
  source: String,
  expectedDate: Date,
  receivedDate: Date,
  weekOfArrival: Number (1-5),
  received: Boolean,
  notes: String,
  budget: ObjectId (Reference to Budget),
  createdAt: Date
}
```

### Expense Model

```javascript
{
  name: String,
  budgetedAmount: Number,
  actualAmount: Number,
  priority: String (Low, Medium, High),
  category: String,
  expectedPurchaseDate: Date,
  actualPurchaseDate: Date,
  status: String (Paid, Unpaid, Partial),
  recurring: Boolean,
  notes: String,
  budget: ObjectId (Reference to Budget),
  createdAt: Date
}
```

### Savings Model

```javascript
{
  targetAmount: Number,
  actualAmount: Number,
  savingMethod: String (Manual, Auto-deduction, Bank Transfer, Other),
  goal: String,
  progressPercentage: Number (0-100),
  notes: String,
  budget: ObjectId (Reference to Budget),
  createdAt: Date
}
```

## Automatic Calculations

The API automatically handles several calculations to maintain data consistency:

1. When incomes are added/updated/deleted, the budget's totalIncome and balances are recalculated
2. When expenses are added/updated/deleted, the budget's totalBudgetedExpenses, totalActualExpenses, and balances are recalculated
3. When savings goals are updated, the progressPercentage is automatically calculated

## Set Up and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```
4. Run the server:
   ```
   npm run dev
   ```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs for password hashing
- CORS for cross-origin support

## Security Notes

This API implementation focuses on functionality for development purposes. For production environments, consider adding:

1. JWT authentication for protected routes
2. Rate limiting
3. Enhanced input validation
4. HTTPS configuration
5. Security headers

## License

ISC