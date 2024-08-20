const mongoose=require("mongoose");

const expenseSchema=new mongoose.Schema({
    item:{type:String, required:true},
    amount:{type:Number, required:true},
    date:{type:Date,  default: Date.now  },
    tag:{type:String, required:true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Add this line
});
const Expense=mongoose.model("Expense", expenseSchema);

module.exports=Expense;