const { incomeSchema, expenseSchema } = require('./schema.js'); // Import the Joi schemas
const ExpressError = require('./utils/ExpressError'); // Import your custom error class




module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in ");
        return res.redirect("/login");
    }
    next();
};

//we are creating it because once the user is logged in 
//the passport changes the details of the session 
//so their is a chance that redirect url may get delete
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

// Middleware for validating Income using Joi
module.exports.validateIncome = (req, res, next) => {
    const result = incomeSchema.validate(req.body);
    if (result.error) {
        const errMsg = result.error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Middleware for validating Expense using Joi
module.exports.validateExpense = (req, res, next) => {
    const result = expenseSchema.validate(req.body);
    if (result.error) {
        const errMsg = result.error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


