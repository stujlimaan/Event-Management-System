const userModel = require("../models/userModel")
const tokenModel=require("../models/tokenModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require("../utilities/validations")

//user handler
const userRegistration = async (req,res)=>{
    try{
        let userData = req.body
        
        if(!validator.isValidBody(userData)){
           return res.status(400).send({status:false,msg:"please enter data in the body"})
        }
        const {firstName,lastName,email,password,phone,address}=userData

        if(!validator.isValidInputValue(firstName)){
            return res.status(400).send({status:false,msg:"please enter first name"})
        }

        if(!validator.isValidOnlyCharacter(firstName)){
            return res.status(400).send({status:false,msg:"please enter first name only characters"})
        }

        if(!validator.isValidInputValue(lastName)){
            return res.status(400).send({status:false,msg:"please enter last name"})
        }

        if(!validator.isValidOnlyCharacter(lastName)){
            return res.status(400).send({status:false,msg:"please enter last name only character"})
        }

        if(!validator.isValidInputValue(email)){
            return res.status(400).send({status:false,msg:"please enter email"})
        }

        if(!validator.isValidEmail(email)){
            return res.status(400).send({status:false,msg:"please enter valid email id like abc@gmail.com"})
        }

        const isUniqueEmail = await userModel.findOne({email})

        if(isUniqueEmail){
            return res.status(400).send({status:false,msg:"this email already exists"})
        }

        if(!validator.isValidInputValue(password)){
            return res.status(400).send({status:false,msg:"please enter password"})
        }

        if(!validator.isValidPassword(password)){
            return res.status(400).send({status:false,msg:"password should be 8 to 15 characters and 1 letter and 1 number"})
        }

        // password encryption
        const salt = await bcrypt.genSalt(10)
        const encryptionPassword = await bcrypt.hash(password,salt)

        if(!validator.isValidInputValue(phone)){
            return res.status(400).send({status:false,msg:"please enter phone"})
        }
        if(!validator.isValidPhone(phone)){
            return res.status(400).send({status:false,msg:"please enter a valid phone number like 6234567894"})
        }


        if(!validator.isValidInputValue(address)){
            return res.status(400).send({status:false,msg:"please enter address"})
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

        if(!validator.isValidBody(userData)){
            return res.status(400).send({status:false,msg:"please enter data in the body "})
        }
        const {email,password}=userData
        if(!validator.isValidInputValue(email)){
            return res.status(400).send({status:false,msg:"please enter email id "})
        }
        if(!validator.isValidEmail(email)){
            return res.status(400).send({status:false,msg:"please enter email id "})
        }
        const userEmail = await userModel.findOne({email})
        console.log(userEmail)

        if(!userEmail){
            return res.status(404).send({status:false,msg:"no user found"})
        }

        if(!password){
            return res.status(404).send({status:false,msg:"please enter password"})
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
        
        if(!token){
            return res.status(400).send({status:false,msg:"token is not created"})
        }
        //setting bearer token in header
        res.header("Authorization","Bearer"+token)
        const userId=userEmail._id
        const loginData = await tokenModel.create({userId,token})
        console.log(token)
        res.status(200).send({status:true,msg:"login successfully",loginData})
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

//user logout handler
const logout = async (req,res)=>{
    try{
         const token = req.header("authorization")
         const userId=req.token.userId
         const loginData = await tokenModel.findById({_id:userId})
         console.log(token,userId,loginData)
         const destroyToken = token.delete
         res.status(200).send({status:true,msg:"logout successfully",token,destroyToken})
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

 //user change password handler
const changePassword = async (req,res)=>{
    try{
        let requestBody = req.body
        let userId = req.token.userId
        console.log(userId)

        if(!validator.isValidBody(requestBody)){
            return res.status(400).send({status:false,msg:"please enter some data in the body"})
        }
        const {email,password,newPassword}=requestBody
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({status:false,msg:"user not found"})
        }
        
        //new password update
        const salt = await bcrypt.genSalt(10);
        const newEncryptedPassword = await bcrypt.hash(newPassword,salt)
        const updatePass={newEncryptedPassword,updatedAt:Date.now()}
        // update password
        const newUpdated= await userModel.findByIdAndUpdate(userId,{$set:{password:updatePass}},{new:true})
        res.send({status:true,msg:"user password updated",data:newUpdated})

        // if(!validator.isValidInputValue(email)){
        //     return res.status(400).send({status:false,msg:"please enter email id"})
        // }
        
        // if(!validator.isValidEmail(email)){
        //     return res.status(400).send({status:false,msg:"please enter valid email id like abc@gmail.com"})
        // }
        
        // if(!validator.isValidInputValue(password)){
        //     return res.status(400).send({status:false,msg:"please enter old password"})
        // }
        // if(!validator.isValidPassword(password)){
        //     return res.status(400).send({status:false,msg:"please enter some data in the body"})
        // }
        
        // if(!validator.isValidBody(requestBody)){
        //     return res.status(400).send({status:false,msg:"please enter some data in the body"})
        // }
        
        // if(!validator.isValidInputValue(newPassword)){
        //     return res.status(400).send({status:false,msg:"please enter new password"})
        // }
        
        // if(!validator.isValidPassword(newPassword)){
        //     return res.status(400).send({status:false,msg:"please enter some data in the body"})
        // }
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

//user update password handler
const updatePassword= async (req,res)=>{
    try{
        let requestBody = req.body
        let userId = req.token.userId

        if(!validator.isValidBody(requestBody)){
            return res.status(400).send({status:false,msg:"please enter some data in the body"})
        }
        const {newPassword}=requestBody
        // if(!validator.isValidInputValue(password)){
        //     return res.status(400).send({status:false,msg:"please enter old password"})
        // }
        // if(!validator.isValidPassword(password)){
        //     return res.status(400).send({status:false,msg:"please enter some data in the body"})
        // }
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({status:false,msg:"user not found"})
        }
        
        //new password update
        const salt = await bcrypt.genSalt(10);
        const newEncryptedPassword = await bcrypt.hash(newPassword,salt)
        const updatePass={password:newEncryptedPassword,updatedAt:Date.now()}
        // update password
        const newUpdated= await userModel.findByIdAndUpdate({_id:userId},{$set:updatePass},{new:true})
        res.send({status:true,msg:"user password updated",data:newUpdated})

        

    }catch(err){
        res.status(500).send({msg:err.message})
    }
}



module.exports = {userRegistration,userLogin,logout,changePassword,updatePassword}