const eventModel = require("../models/eventModel")


const createEvent = async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const inviteUser = async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const list = async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const eventDetails = async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const eventUpdate = async (req,res)=>{
    try{

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}


module.exports = {createEvent,inviteUser,list,eventDetails,eventUpdate}