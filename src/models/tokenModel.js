const mongoose = require("mongoose")
const objectId=mongoose.Schema.Types.ObjectId
const tokenSchema = new mongoose.Schema({
    userId:{
        type:objectId,
        required:true,
        ref:"user"
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{type:Date,default:Date.now,expires:3600}
},{timestamps:true})

module.exports=mongoose.model("Token",tokenSchema)