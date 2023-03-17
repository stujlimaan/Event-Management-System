const mongoose = require("mongoose")
const objectId=mongoose.Schema.Types.ObjectId

const eventSchema = new mongoose.Schema({
  userId:{
    type:objectId,
    required:true,
    ref:"user"
},
    eventId:{
        type:Number,
        required:true,
        trim:true,
        unique:true
    },
  eventName: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  fullDesc: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentBookings: {
    type: Number,
    default: 0
  },
  promoCode: String,
  discount: Number,
  price: Number
},{timestamps:true})

module.exports = mongoose.model("Event",eventSchema)