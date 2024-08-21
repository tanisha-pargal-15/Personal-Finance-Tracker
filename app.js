if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const ejsMate=require("ejs-mate");
const path=require("path");
const methodOverride=require("method-override");
const bodyParser = require('body-parser');
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const ExpressError=require("./utils/ExpressError");

const Income = require("./models/income.js");
const Expense = require("./models/expense.js");
const User=require("./models/user.js");


const {validateExpense, validateIncome, isLoggedIn}=require("./middleware.js");

  app.use(bodyParser.json());
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.listen(8080,()=>{
    console.log("server is listening on 8080");
});

// to use static files
app.use(express.static(path.join(__dirname,"public")));


// const dbUrl='mongodb://127.0.0.1:27017/spendsmart';
const dbUrl=process.env.ATLASDB_URL;
//set up for database
const mongoose=require("mongoose");

main().then((res) =>{
    console.log(res);
    console.log("connection created sucessfully");
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
  }



const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
});
store.on("error",()=>{
    console.log("Error in mongo store for session",err);
})
//session
const sessionOptions={
    store:store,
    secret: 'your-secret-key',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,//expire date of session
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.smsg=req.flash("success");
    res.locals.emsg=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.get("/",(req,res)=>{
   res.redirect('/tracker');
});

app.get("/tracker", isLoggedIn, async (req, res) => {
    try {
        const totalIncomeResult = await Income.aggregate([
            { $match: { user: req.user._id } }, // Filter by the logged-in user
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

        // Calculate total expense
        const totalExpenseResult = await Expense.aggregate([
            { $match: { user: req.user._id } }, // Filter by the logged-in user
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const totalExpense = totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0;

        // Calculate current balance
        const currentBalance = totalIncome - totalExpense;

        const incomes = await Income.find({ user: req.user._id }); // Filter by user
        const expenses = await Expense.find({ user: req.user._id }); // Filter by user

        const combinedData = [
            ...incomes.map(income => ({ ...income.toObject(), type: 'Income' })),
            ...expenses.map(expense => ({ ...expense.toObject(), type: 'Expense' }))
        ];

        res.render("./ptracker/main.ejs", { data: combinedData, totalIncome, totalExpense, currentBalance });
    } catch (error) {
        console.error("Error fetching total income:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/add-income",(req,res)=>{
    res.render("./ptracker/add-income");
});

app.get("/add-expense",(req,res)=>{
    res.render("./ptracker/add-expense");
});

app.post("/add-income",isLoggedIn, validateIncome, async (req, res) => {
    const { title, amount, date, tag } = req.body;
    const newIncome = new Income({ title, amount, date, tag, user: req.user._id  });
    await newIncome.save().then((res)=>{
        console.log(res);
    });
    req.flash('success', 'Income added successfully!');
    res.redirect("/tracker");
});

app.post("/add-expense",isLoggedIn, validateExpense, async (req, res) => {
    const { item, amount, date, tag } = req.body;
    const newExpense = new Expense({ item, amount, date, tag, user: req.user._id });
    await newExpense.save().then((res)=>{
        console.log(res);
    });
    req.flash('success', 'Expense added successfully!');
    res.redirect("/tracker");
});



// Save CSV data endpoint
app.post('/save-csv-data-income', isLoggedIn,  async (req, res) => {
    try {
        const { title, amount, date, tag } = req.body;
        console.log(req.body);
        // Validate required fields
        if (!title || !amount || !date || !tag) {
            return res.status(400).send('Missing required fields');
        }

        // Ensure date is a valid Date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).send('Invalid date format');
        }
        const type="income";
        // Choose the correct model based on the type
        const Model = type.toLowerCase() === 'income' ? Income : Expense;
        console.log(Model);
        
        // Create a new entry
        const newEntry = new Model({ title, amount, date: parsedDate, tag,  user: req.user._id });
        await newEntry.save();

        // Send a success response
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

// Endpoint to handle saving expense data
app.post('/save-csv-data-expense', isLoggedIn, async (req, res) => {
    try {
        const { item, amount, date, tag } = req.body;
        console.log(req.body);
        // Validate required fields
        if (!item || !amount || !date || !tag) {
            return res.status(400).send('Missing required fields');
        }

        // Ensure date is a valid Date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).send('Invalid date format');
        }

        // Create a new entry
        const newEntry = new Expense({ item, amount, date: parsedDate, tag,  user: req.user._id });
        await newEntry.save();

        // Send a success response
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

// Fetch income data
app.get('/income-data', isLoggedIn, async (req, res) => {
    try {
        const incomeData = await Income.find({ user: req.user._id }); // Filter by user
        res.json(incomeData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch expense data grouped by tag
app.get('/api/expenses', isLoggedIn, async (req, res) => {
    try {
        const expenses = await Expense.aggregate([
            { $match: { user: req.user._id } }, // Filter by user
            {
                $group: {
                    _id: "$tag",
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    tag: "$_id",
                    amount: "$totalAmount"
                }
            }
        ]);

        res.json(expenses);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

app.post("/signup", async(req,res,next)=>{
    try{
        let{username, email, password}=req.body;
    const newUser=new User({email, username});
    const registeredUser=await User.register(newUser, password);
    console.log(registeredUser);
    //automatically login after sign up
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "user registered and loggedin successfully");
    res.redirect("/tracker");
    });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});


app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

app.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/login", failureFlash:true
    }) , 
     async(req,res)=>{
    req.flash("success", "Welcome: You are logged in");
    let redirectUrl=res.locals.redirectUrl || "/tracker";
    res.redirect(redirectUrl);
});

app.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/tracker");
    });
});


app.delete('/delete-entry/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    try {
        // First, find the entry to log it
        const deletedIncome = await Income.findByIdAndDelete(id);
        const deletedExpense = await Expense.findByIdAndDelete(id);

        // Log the deleted entry to the console
        if (deletedIncome) {
            console.log('Deleted Income Entry:', deletedIncome);
        } else if (deletedExpense) {
            console.log('Deleted Expense Entry:', deletedExpense);
        } else {
            console.log('Entry not found for deletion');
        }

        req.flash('success', 'Entry deleted successfully');
        res.status(200).send();
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).send('Error deleting entry');
    }
});


app.delete('/reset-data', isLoggedIn, async (req, res) => {
    try {
        // Delete all records from Income and Expense collections for the logged-in user
        await Income.deleteMany({ user: req.user._id });
        await Expense.deleteMany({ user: req.user._id });

        console.log(`All data for user ${req.user._id} has been deleted from Income and Expense collections.`);
        res.status(200).send('All your data has been deleted successfully.');
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('An error occurred while deleting your data.');
    }
});






//error handling midleware
app.use((err,req,res,next)=>{
    let{statusCode=500, message="some unknown error"}=err;
    console.log(statusCode);
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
});






