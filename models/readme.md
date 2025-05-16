# FaBudget Database Schema Documentation

## Overview
FaBudget is a comprehensive personal budgeting application built on MongoDB using Mongoose as the ODM (Object Document Mapper). The system employs a relational schema design that connects users, budgets, incomes, expenses, and savings goals through references, enabling sophisticated financial tracking and management.

## Database ER Diagram
```
┌───────────────────┐          ┌────────────────────┐        ┌────────────────────┐
│      User         │          │      Budget        │        │      Income        │
├───────────────────┤          ├────────────────────┤        ├────────────────────┤
│ _id               │◄─────────┤ user               │◄───────┤ budget             │
│ name              │          │ month              │        │ type               │
│ email             │          │ year               │        │ amount             │
│ password          │          │ title              │        │ source             │
│ resetPasswordToken│          │ totalIncome        │        │ expectedDate       │
│ resetPasswordExpire          │ totalBudgetedExpenses       │ receivedDate       │
│ createdAt         │          │ totalActualExpenses│        │ weekOfArrival      │
└───────────────────┘          │ balanceProjected   │        │ received           │
                               │ balanceActual      │        │ notes              │
                               │ notes              │        │ createdAt          │
                               │ isActive           │        └────────────────────┘
                               │ createdAt          │
                               └────────────────────┘
                                       ▲    ▲
                                       │    │
                 ┌────────────────────┐│    │┌────────────────────┐
                 │     Expense        ││    ││     Savings        │
                 ├────────────────────┤│    │├────────────────────┤
                 │ budget             │┘    └┤ budget             │
                 │ name               │      │ targetAmount       │
                 │ budgetedAmount     │      │ actualAmount       │
                 │ actualAmount       │      │ savingMethod       │
                 │ priority           │      │ goal               │
                 │ category           │      │ progressPercentage │
                 │ expectedPurchaseDate      │ notes              │
                 │ actualPurchaseDate │      │ createdAt          │
                 │ status             │      └────────────────────┘
                 │ recurring          │
                 │ notes              │
                 │ createdAt          │
                 └────────────────────┘
```

## Database Models

### 1. User Model
The foundation of the application's authentication and personalization system.

**Schema:**
- **name**: String (required, trimmed)
- **email**: String (required, unique, validated with regex pattern)
- **password**: String (required, min length: 6, excluded from queries by default)
- **resetPasswordToken**: String (optional)
- **resetPasswordExpire**: Date (optional)
- **createdAt**: Date (default: current timestamp)

**Special Features:**
- Password encryption using bcrypt with salt factor of 10
- Password comparison method for authentication
- Middleware to automatically hash passwords before saving

### 2. Budget Model
The central model that organizes financial data by month and year.

**Schema:**
- **month**: Number (required, range: 1-12)
- **year**: Number (required, min: 2020)
- **title**: String (required, trimmed)
- **user**: ObjectId (reference to User model, required)
- **totalIncome**: Number (default: 0)
- **totalBudgetedExpenses**: Number (default: 0)
- **totalActualExpenses**: Number (default: 0)
- **balanceProjected**: Number (default: 0)
- **balanceActual**: Number (default: 0)
- **notes**: String (optional, trimmed)
- **isActive**: Boolean (default: true)
- **createdAt**: Date (default: current timestamp)

**Indexes:**
- Compound index on `{month, year, user}` with uniqueness constraint

**Virtual Fields:**
- **incomes**: Array of Income documents related to this budget
- **expenses**: Array of Expense documents related to this budget
- **savings**: Array of Savings documents related to this budget

### 3. Income Model
Tracks all sources of income within a specific budget period.

**Schema:**
- **type**: String (required, trimmed) - e.g., salary, gift, loan
- **amount**: Number (required, min: 0)
- **source**: String (required, trimmed)
- **expectedDate**: Date (required)
- **receivedDate**: Date (optional, default: null)
- **weekOfArrival**: Number (required, range: 1-5)
- **received**: Boolean (default: false)
- **notes**: String (optional, trimmed)
- **budget**: ObjectId (reference to Budget model, required)
- **createdAt**: Date (default: current timestamp)

### 4. Expense Model
Records planned and actual expenses within a budget period.

**Schema:**
- **name**: String (required, trimmed)
- **budgetedAmount**: Number (required, min: 0)
- **actualAmount**: Number (default: 0, min: 0)
- **priority**: String (enum: 'Low', 'Medium', 'High', default: 'Medium')
- **category**: String (required, trimmed)
- **expectedPurchaseDate**: Date (required)
- **actualPurchaseDate**: Date (optional, default: null)
- **status**: String (enum: 'Paid', 'Unpaid', 'Partial', default: 'Unpaid')
- **recurring**: Boolean (default: false)
- **notes**: String (optional, trimmed)
- **budget**: ObjectId (reference to Budget model, required)
- **createdAt**: Date (default: current timestamp)

### 5. Savings Model
Manages savings goals and progress within a budget period.

**Schema:**
- **targetAmount**: Number (required, min: 0)
- **actualAmount**: Number (default: 0, min: 0)
- **savingMethod**: String (required, enum: 'Manual', 'Auto-deduction', 'Bank Transfer', 'Other', default: 'Manual')
- **goal**: String (required, trimmed)
- **progressPercentage**: Number (default: 0, range: 0-100)
- **notes**: String (optional, trimmed)
- **budget**: ObjectId (reference to Budget model, required)
- **createdAt**: Date (default: current timestamp)

**Middleware:**
- Pre-save hook to automatically calculate progress percentage based on actual vs target amounts

## Relationships

1. **One-to-Many: User to Budget**
   - A User can have multiple Budget documents
   - Each Budget belongs to exactly one User

2. **One-to-Many: Budget to Income/Expense/Savings**
   - A Budget can have multiple Income, Expense, and Savings documents
   - Each Income, Expense, or Savings document belongs to exactly one Budget

3. **Indirect User to Financial Data**
   - Users relate to Income, Expense, and Savings documents through the Budget model
   - This design maintains data integrity and proper access control

## Data Integrity Features

1. **Validation Rules**
   - Required fields with custom error messages
   - Minimum and maximum value constraints
   - Enum constraints for predefined options
   - Regular expression pattern validation (email)

2. **Default Values**
   - Sensible defaults for optional fields
   - Automatic timestamps for tracking creation dates

3. **Computed Properties**
   - Savings progress percentage automatically calculated

4. **Security Measures**
   - Password hashing for User authentication
   - Password exclusion from standard queries

## Performance Optimizations

1. **Indexing**
   - Compound index on Budget model for efficient retrieval by month/year/user
   - Implicit index on referenced fields (_id)

2. **Virtual Fields**
   - Virtual population capabilities for related data without additional queries

## Technical Implementation Notes

1. **MongoDB Connection**
   - Connection is established via a dedicated configuration module (config/db.js)
   - Environment variables used for database credentials (MONGO_URI)

2. **Authentication**
   - Password-based authentication with bcrypt
   - Password reset functionality built into the schema

3. **API Organization**
   - Routes organized by model type (users, budgets, expenses, incomes, savings)
   - RESTful architecture implied by file structure

## Database Schema Use Cases

### 1. Monthly Budget Management
Users can create a budget for each month, track expected vs. actual incomes and expenses, and measure progress toward savings goals.

### 2. Financial Performance Analysis
The schema allows analysis of:
- Income stability across months
- Expense patterns by category
- Budget adherence (planned vs. actual)
- Savings goal achievement rates

### 3. Recurring Financial Planning
The system supports:
- Recurring expense tracking
- Priority-based spending decisions
- Weekly income planning
- Savings goal progression

### 4. Data Insights
The structure enables extraction of valuable insights:
- Spending patterns by category
- Income reliability by source
- Budget allocation effectiveness
- Savings efficiency over time

## Advanced Schema Relationships

### Cascading Operations
When implemented in the application logic:
- Deleting a Budget should cascade to delete related Income, Expense, and Savings records
- Deleting a User should either cascade to delete all related Budgets (and by extension all financial data) or archive the data

### Aggregation Possibilities
The schema structure enables sophisticated MongoDB aggregation pipelines for:
- Total financial overview across multiple budget periods
- Category-based spending analysis
- Income vs. expense ratio trends
- Savings goal achievement rates

### Data Migration and Evolution
The schema supports:
- Adding new financial categories without structural changes
- Extending models with additional attributes
- Implementation of financial data import/export mechanisms
- Integration with external financial services via API

This comprehensive schema provides a robust foundation for financial management, enabling users to track, analyze, and optimize their personal budgeting with detailed visibility into all aspects of their finances.