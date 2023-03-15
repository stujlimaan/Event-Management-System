const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//user handler
const userRegistration = async (req,res)=>{
    try{
        let userData = req.body
        
        if(Object.keys(userData).length ==0){
           return res.status(400).send({status:false,msg:"please provide data in the body"})
        }
        const {firstName,lastName,email,password,phone,address}=userData
        if(!firstName){
            return res.status(400).send({status:false,msg:"please provide first name"})
        }

        if(!lastName){
            return res.status(400).send({status:false,msg:"please provide last name"})
        }

        if(!email){
            return res.status(400).send({status:false,msg:"please provide email"})
        }

        if(!password){
            return res.status(400).send({status:false,msg:"please provide password"})
        }

        // password encryption
        const salt = await bcrypt.genSalt(10)
        const encryptionPassword = await bcrypt.hash(password,salt)

        if(!phone){
            return res.status(400).send({status:false,msg:"please provide phone"})
        }
        if(!address){
            return res.status(400).send({status:false,msg:"please provide address"})
        }
        userData={firstName:firstName,lastName:lastName,email:email,password:encryptionPassword,phone:phone,address:address}
        const user = await userModel.create(userData)
        res.status(201).send({status:true,msg:"user created successfully",users:user})
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

//user login handler
const userLogin= async (req,res)=>{
    try{
        const userData = req.body

        if(Object.keys(userData).length==0){
            return res.status(400).send({status:false,msg:"please provide data in the body "})
        }
        const {email,password}=userData
        if(!email){
            return res.status(400).send({status:false,msg:"please provide email id "})
        }

        const userEmail = await userModel.findOne({email})
        console.log(userEmail)

        if(!userEmail){
            return res.status(404).send({status:false,msg:"no user found"})
        }

        if(!password){
            return res.status(404).send({status:false,msg:"please provide password"})
        }
        //comparing hashed password and login password
        const isPasswordMatching = await bcrypt.compare(password,userEmail.password)
        if(!isPasswordMatching){
            return res.status(400).send({status:false,msg:"incorrect password"})
        }
        //creating jwt token
        const payload = {userId:userEmail._id}
        const expiry ={expiresIn:"1800s"} 
        const secret_key = process.env.SECRET_KEY
        const token = jwt.sign(payload,secret_key,expiry)
        
        //setting bearer token in header
        res.header("Authorization","Bearer"+token)
        console.log(token)
        res.status(200).send({status:true,msg:"login successfully", token})
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

//user logout handler
const logout = async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

 //user change password handler
const changePassword = async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

//user update password handler
const updatePassword= async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({msg:err.message})
    }
}



module.exports = {userRegistration,userLogin,logout,changePassword,updatePassword}