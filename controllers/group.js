const User=require('../models/user')
const Group=require('../models/group')
const userGroup = require('../models/userGroup')

exports.createGroup=(req,res)=>{

    const{grpName, isAdmin}=req.body
    
    req.user.createGroup({groupname:grpName}).then(result=>{
        
        userGroup.update({isAdmin: true},{where:{userId: req.user.id}})
        .then(response=>{
            
           return res.status(201).json({message:"group added"})
        })
        
    })
    .catch(err=>{
        console.error(err)
    })
}
exports.getMembers=(req,res)=>{
    console.log(req.user.grpId)
    let allUser = [];
    let adminData=[];

    const groupId = req.query.grpId
    userGroup.findAll({where:{groupId:groupId}})
    .then(users=>{
        
       
        for (i=0; i<users.length; i++){
            
            //User.findOne({where:{id:users[i].userId}}).then(user=>{
                if(users.length>0){
                
                allUser.push({name:users[i].userId,isAdmin:users[i].isAdmin})
               
            }
            else{
               return  res.status(401).json({message:' NO Users'}) 
            }
            
        }
        return res.status(201).json({message:'Users Fetched',success:true,listOfUsers:allUser}) 
      
      
    }).catch(err=>console.log(err))
}
exports.getGroups=(req,res)=>{
    console.log(req.user.id)
    req.user.getGroups()
    .then(groups=>{
        res.status(200).json({groups})
    }).catch(err=>console.log(err))
}

exports.getIsAdmin = (req, res, next)=>{
    //console.log(req.query.grpId)
    const groupId = req.query.grpId
    userGroup.findOne({where:{
        userId: req.user.id,
        groupId: groupId
    }})
    .then(user=>{
        //console.log(user)
        return res.status(200).json({user})
    })
    .catch(err=>console.log(err))
    
}
exports.getUser = (req,response,next)=>{
    const loggedInUser = req.user.name;
   let allUser = [];
   // console.log(loggedInUser);
   User.findOne({where:{id:req.user.id}})
   .then(user=>{
    
        allUser.push(user.name)
    
      
       return response.status(200).json({listOfUser:allUser});
   })
   .catch(err=>{
       return response.status(402).json({message:"Wrong path", success:false})
   })
}
exports.addMember = async (req,res,next) => {
    try {
        let userId;
        let isAdmin = false;
        const {memberEmail,groupId} = req.body
        
        const user = await User.findAll({where:{email:memberEmail}})
        if(!user.length>0){
            return res.status(403).json({message:'User does not exists!',success:false})
        }
        userId = user[0].dataValues.id;
       
        const group = await Group.findOne({where:{id:groupId}})
        
        if(!group){
             res.status(403).json({message:'Group does not exists!',success:false})
        }
      
        success =await userGroup.create({isAdmin,groupId,userId})
        if(success){
         res.status(201).json({message:'User Added To The Group',success:true})
        }
    } catch (error) {
         res.status(401).json({message:'Member is already in the group',success:false})
    }
}