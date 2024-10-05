const { type } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");
const Schema = moongose.Schema; 

const reviewSchema = new Schema({
    comment : String,
    rating :{
        type:Number,
        min:1,
        max:5,
        default:1 
    },
    createdAt:{
       type : Date,
       default:Date.now()
    }, 
    author:{
       type:Schema.Types.ObjectId,
       ref:"User"
    }, 
}); 

module.exports = mongoose.model("Review",reviewSchema); 