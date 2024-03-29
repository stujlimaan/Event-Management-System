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
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    InvitedUser:[
        {userName:{type:String},link:{type:String}},
    ],
    InvitedMe:[
        {whoInvite:{type:String},link:{type:String}},
    ],
    // eventsBooked: [Number],
    history: [
        {
          action: String,
          time: Date
        }
      ],

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
