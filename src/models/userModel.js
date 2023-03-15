const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:Number,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:null
    },
    deletedAt:{
        type:Date,
        default:null
    },
    updatedAt:{
        type:Date,
        default:null
    }

},{timestamps:true})

module.exports = mongoose.model('User',userSchema)
