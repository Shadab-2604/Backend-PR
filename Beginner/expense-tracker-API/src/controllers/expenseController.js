const Expense = require('../models/expenseModel');

const getExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
};

const addExpense = async (req, res) => {
    const { category, amount, description } = req.body;
    const expense = await Expense.create({ 
        user: req.user.id, 
        category, 
        amount, 
        description 
    });
    res.status(201).json(expense);
};

module.exports = { getExpenses, addExpense };
