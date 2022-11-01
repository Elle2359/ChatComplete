const User = require('../models/user')
const Group = require('../models/group')
const userGroup = require('../models/userGroup')

exports.adminCheck = (req, res, next)=>{
    console.log(req.body.grpId)
    userGroup.findOne({where:{
        userId: req.user.id,
        groupId: req.body.grpId
    }})
    .then(result=>{
        console.log(result)

        if(result == null){
            res.status(404).json({msg: "User not in group. Please add user first"})
        }
        
        if(!result.isAdmin){
            res.status(401).json({msg: "You are not admin"})
        }
        else{
            next()
        }
    })
    .catch(err=>console.log(err))
}

exports.postAddMember = (req, res, next)=>{
    console.log(req.body)

    const addEmail = req.body.email
    const grpId = req.body.grpId

    User.findOne({where:{email: addEmail}})
    .then(addUser=>{

        if(addUser == null){
            res.status(404).json({msg: 'User does not exist or Invalid email id'})
        }
        else{
            let userId = addUser.id
    
            userGroup.create({
                userId: userId,
                groupId: grpId
            })
            .then(newMember=>{
                res.send({newMember})
            })
            .catch(err=>{
                console.log(err)
                res.status(401).json({msg:'User already present in group'})
            })
    
        }
    }).catch(err=>console.log(err))

    //console.log(addUser)
}


exports.postRemoveMember = (req, res, next)=>{
    const removeEmail = req.body.email
    const grpId = req.body.grpId

    User.findOne({where:{email: removeEmail}})
    .then(removeUser=>{

        if(removeUser == null){
            res.status(404).json({msg: 'User does not exist or Invalid email id'})
        }
        else{
            let userId = removeUser.id
    
            userGroup.destroy({where:{
                userId: userId,
                groupId: grpId
            }})
            .then(removeMember=>{
                res.send({removeMember})
            })
            .catch(err=>{
                console.log(err)
                res.status(401).json({msg:'User not in group'})
            })
    
        }
    }).catch(err=>console.log(err))
}

exports.postMakeAdmin = (req, res, next)=>{
    const adminEmail = req.body.email
    const grpId = req.body.grpId

    User.findOne({where:{email: adminEmail}})
    .then(adminUser=>{

        if(adminUser == null){
            res.status(404).json({msg: 'User does not exist or Invalid email id'})
        }
        else{
            let userId = adminUser.id
    
            userGroup.update({isAdmin: true},{
                where:{
                userId: userId,
                //groupId: grpId
            }})
            .then(adminMember=>{
                res.send({msg:"user added",adminMember})
            })
            .catch(err=>{
                console.log(err)
                res.status(401).json({msg:'User not in group'})
            })
    
        }
    }).catch(err=>console.log(err))
}


exports.postRemoveAdmin = (req, res, next)=>{
    const adminEmail = req.body.email
    const grpId = req.body.grpId

    User.findOne({where:{email: adminEmail}})
    .then(adminUser=>{

        if(adminUser == null){
            res.status(404).json({msg: 'User does not exist or Invalid email id'})
        }
        else if(adminUser.id == req.user.id){
            res.status(401).json({msg:'You cannot remove youself from admin postition'})
        }
        else{
            let userId = adminUser.id
    
            userGroup.update({isAdmin: false},{
                where:{
                userId: userId,
                //groupId: grpId
            }})
            .then(adminMember=>{
                res.send({adminMember})
            })
            .catch(err=>{
                console.log(err)
                res.status(401).json({msg:'User not in group'})
            })
    
        }
    }).catch(err=>console.log(err))
}