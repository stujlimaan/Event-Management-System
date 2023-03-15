const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const config = require("dotenv").config()
const route= require("./routes/route")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//connect with mongodb
mongoose.connect(process.env.MONGO_DB_URL,{
    useNewUrlParser:true
}).then(()=>{console.log("mongodb connected successfully")})
.catch((err)=>{console.log(err)})

app.use("/",route)


const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})