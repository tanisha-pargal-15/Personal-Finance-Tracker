const Joi = require('joi');

// Income Schema Validation
module.exports.incomeSchema = Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().required().min(1),
    date: Joi.date().default(Date.now),
    tag: Joi.string().required()
});

// Expense Schema Validation
module.exports.expenseSchema = Joi.object({
    item: Joi.string().required(),
    amount: Joi.number().required().min(1),
    date: Joi.date().default(Date.now),
    tag: Joi.string().required()
});
