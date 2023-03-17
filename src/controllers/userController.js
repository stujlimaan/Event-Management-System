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
         const loginData = await tokenModel.findOne({userId:userId})
         const logout = await tokenModel.findByIdAndUpdate(userId,{$unset:{token:""}},{new:true})
         res.status(200).send({status:true,msg:"logout successfully",logout})
    }catch(err){
        res.status(500).send({msg:err.message})
    }
}

 //user change password handler
const changePassword = async (req,res)=>{
    try{
        let requestBody = req.body
        // let userId = req.token.userId

        if(!validator.isValidBody(requestBody)){
            return res.status(400).send({status:false,msg:"please enter some data in the body"})
        }
        const {email,newPassword,confirmPassword}=requestBody
        if(!validator.isValidInputValue(email)){
            return res.status(400).send({status:false,msg:"please enter email id"})
        }
        if(!validator.isValidEmail(email)){
            return res.status(400).send({status:false,msg:"please enter valid email id like abc@gmail.com"})
        }
        const userDetail = await userModel.findOne({email:email})
        
        if(!userDetail){
            return res.status(404).send({status:false,msg:"user not found"})
        }

        if(!validator.isValidInputValue(newPassword)){
            return res.status(400).send({status:false,msg:"please enter new password"})
        }

        if(!validator.isValidPassword(newPassword)){
            return res.status(400).send({status:false,msg:"new password should be 8 to 15 characters and 1 letter and 1 number"})
        }
        if(!validator.isValidInputValue(confirmPassword)){
            return res.status(400).send({status:false,msg:"please enter confirm password"})
        }

        if(!validator.isValidPassword(confirmPassword)){
            return res.status(400).send({status:false,msg:"confirm password should be 8 to 15 characters and 1 letter and 1 number"})
        }

        if(!(newPassword===confirmPassword)){
            return res.status(400).send({status:false,msg:"new password and confirm password does not match"})
        }
        
        //new password update
        const salt = await bcrypt.genSalt(10);
        const newEncryptedPassword = await bcrypt.hash(newPassword,salt)
        const updatePass={password:newEncryptedPassword,updatedAt:Date.now()}
        // update password
        const newUpdated= await userModel.findOneAndUpdate({email:email},{$set:updatePass},{new:true})
        res.send({status:true,msg:"user reset password updated",data:newUpdated})

        

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
        const {oldPassword,newPassword,confirmPassword}=requestBody
        if(!validator.isValidInputValue(oldPassword)){
            return res.status(400).send({status:false,msg:"please enter old password"})
        }
        if(!validator.isValidPassword(oldPassword)){
            return res.status(400).send({status:false,msg:"old password should be 8 to 15 characters and 1 letter and 1 number"})
        }
        const userDetail = await userModel.findById({_id:userId})
        
        if(!userDetail){
            return res.status(404).send({status:false,msg:"user not found"})
        }
        const decPassword = await bcrypt.compare(oldPassword,userDetail.password)

        // const userPassword = await userModel.findOne({password:userDetail.password})
        if(!decPassword){
            return res.status(400).send({status:false,msg:"please enter carrect old password"})
        }
        if(!validator.isValidInputValue(newPassword)){
            return res.status(400).send({status:false,msg:"please enter new password"})
        }

        if(!validator.isValidPassword(newPassword)){
            return res.status(400).send({status:false,msg:"new password should be 8 to 15 characters and 1 letter and 1 number"})
        }
        if(!validator.isValidInputValue(confirmPassword)){
            return res.status(400).send({status:false,msg:"please enter confirm password"})
        }

        if(!validator.isValidPassword(confirmPassword)){
            return res.status(400).send({status:false,msg:"confirm password should be 8 to 15 characters and 1 letter and 1 number"})
        }

        if(!(newPassword===confirmPassword)){
            return res.status(400).send({status:false,msg:"new password and confirm password does not match"})
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