const jwt = require('jsonwebtoken');
const User = require('../models/user')
const dotenv=require('dotenv')

dotenv.config()
const uuid= require('uuid')
var TOKEN_SECRET = uuid.v4();
 exports.authenticateToken = (req, res, next)=> {
    
        const token=req.header('authorization');
         console.log(token)
        const userId=Number(jwt.verify(token, process.env.TOKEN_SECRET));
        //console.log(userId)
        User.findByPk(userId)
        .then(user=>{
            req.user=user;
            next()
        }) 
        .catch(err=>{
            console.log(err);
        })  
        
    }   
  
