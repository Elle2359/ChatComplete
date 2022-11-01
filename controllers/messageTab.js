const User = require('../models/user');
const Message = require('../models/message');
const {Op} = require('sequelize')




exports.postMessage = (req,res,next)=>{
    const senderName =  req.user.name
    const {message} = req.body;
    console.log(message,senderName);
    req.user.createMessage({senderName,message})
    .then(msg=>{
        return res.status(201).json({msg,success:true})
    })
    .catch(err=>{
        return res.status(403).json({err,success:false})
    })
}

exports.getMessage = async (req,res,next)=>{
    try {
        const mid = req.query.id;
        const messages = await Message.findAll({where:{id:{[Op.gte]:mid},groupId:null}})
        res.status(200).json({messages})
    } catch (error) {
        res.status(401).json({error})
    }    
}