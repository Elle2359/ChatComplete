const express=require('express');
const Message=require('../models/message')
const Group=require('../models/group')

exports.addMessage = (req, res, next)=>{

    const groupId=req.body.groupid
    //onsole.log(groupId)
    const msg=req.body.msg
    //console.log(req.user.name, msg)

    req.user.createMessage({
        msg:msg,
        name:req.user.name,
        gId:groupId

    }).then(result=>{
       res.status(200).json({result})
    })
    .catch(err=>{
        console.error(err)
    })
}

exports.getMessages = async(req, res, next)=>{
    
    console.log(req.query.grpId)
    const groupId = req.query.grpId

    Message.findAll({where:{gId: groupId}})
    .then(messages=>{
        //console.log(messages)
        if(messages){
        res.status(201).json({messages})
        }
        else{
            res.status(401).json({message:'No Msgs',success:false})
        }
    })
    .catch(err=>console.log(err))

    
}