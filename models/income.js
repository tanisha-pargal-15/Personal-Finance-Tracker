const mongoose=require("mongoose");

const incomeSchema=new mongoose.Schema({
    title:{type:String, required:true},
    amount:{type:Number, required:true},
    date:{type:Date,  default: Date.now  },
    tag:{type:String, required:true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Add this line
});
const Income=mongoose.model("Income", incomeSchema);

module.exports=Income;