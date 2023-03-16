const userModel= require("../models/userModel")
const validator = require("../utilities/validations")
const jwt = require("jsonwebtoken")

const authentication = async (req,res,next)=>{
    try{
        let bearerToken = req.headers["authorization"]

        if(!validator.isValidInputValue(bearerToken)){
            return res.status(400).send({status:false,msg:"please provide token in header"})
        }

    
        const token = bearerToken.split(" ")[1]
        if(!token){
            return res.status(400).send({status:false,msg:"please enter token"})
        }
        const secretkey = process.env.SECRET_KEY
        const decodedToken = jwt.verify(token,secretkey,{ignoreExpiration:true})

        if( Date.now() > decodedToken.exp * 1000){
            return res.status(401).send({status:false,msg:"authentication failed : session expired"})
        }

        req.token = decodedToken
        next()
        // res.status(200).send({status:true,msg:"user"})
    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const authorization = async (req,res,next)=>{
    try{

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

module.exports = {authentication,authorization}