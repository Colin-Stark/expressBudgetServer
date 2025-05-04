# Budgeting App – Project Requirements

This document outlines the functional requirements for the **Budgeting App**, a personal finance tool designed to help users manage income, expenses, and savings on a monthly basis.

## Functional Requirements

| ID     | Requirement                     | User Story | Expected Behaviour / Outcome |
|--------|----------------------------------|------------|-------------------------------|
| FR001  | Create Monthly Budget            | As a user, I want to create a monthly budget to plan my finances for the month. | The app should allow the user to start a new budget for each month with fields for income and expenses. |
| FR002  | Add Income Details               | As a user, I want to input expected income with details like type of income, amount, source, and expected date of arrival so I can track my cash inflows. | The app should provide input fields for expected income, week of arrival, type (gift, salary, loan, etc.), amount, source, and date received. |
| FR003  | Add Expense Items                | As a user, I want to list my monthly expenses with budgeted amounts, priority levels, and statuses. | The app should allow users to enter expense name, budgeted amount, priority level, and expected purchase date. |
| FR004  | Update Expense Status            | As a user, I want to update the status of each item (purchased/done or not) and the actual price so I can monitor my spending. | The app should provide an option to mark expenses as "Paid" or "Unpaid" and record the actual amount spent and the purchase date. |
| FR005  | Monthly Totals Calculation       | As a user, I want to see my total income, total expenses, balance left, and carried-over expenses. | The app should calculate and display the total income, total expenses, balance, and carry-over amounts. |
| FR006  | Overspending Alerts              | As a user, I want to get alerts when I'm overspending based on my set budget so I can adjust my expenses. | The app should notify users when their expenses exceed their income or budgeted limits. |
| FR007  | Bill Payment Reminders           | As a user, I want reminders to pay bills or buy important items marked as “High Priority” before due dates. | The app should provide timely reminders based on the user's inputs and set deadlines. |
| FR008  | Track Recurring Expenses         | As a user, I want the app to automatically save and track recurring monthly expenses so I don't have to re-enter them every month. | The app should allow users to mark expenses as "recurring" and auto-fill them in future months. |
| FR009  | Setting and Tracking Savings Goals | As a user, I want to set a savings target for each month, choose my saving method, and record how much I actually saved so I can build financial discipline. | The app should offer a savings section where users can enter target amount, select saving method (manual, auto-deduction, bank etc.), and input actual amount saved. It should summarize progress alongside the monthly budget. |
| FR010  | Edit Income and Expense Entries  | As a user, I want to edit existing income and expense entries in case of mistakes or changes. | The app should allow easy editing of all budget fields. |
| FR011  | Delete Budget Entries            | As a user, I want to delete income or expense entries that are no longer relevant. | The app should allow users to delete any item from their budget records. |
| FR012  | Monthly Budget Overview          | As a user, I want to view a dashboard showing a summary of my budget, savings, expenses, and balance. | The app should display a clean overview with graphs/charts if possible. |
| FR013  | Auto-Save Data, Data Backup and Sync | As a user, I want my budget data backed up, synchronized across devices, and saved automatically so I don’t lose information. | The app should auto-save user inputs without needing manual saving, allow data backup and sync if logged in across devices. |

---

