const User = require('../models/user')
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const saltRounds = 10;
const jwt = require('jsonwebtoken')


exports.postSignup = async (req, res, next)=>{
    let userDetails = req.body

    let existingUser = await User.findAll({where:{email: userDetails.email}})
    //console.log(existingUser)

    if(existingUser.length === 0){
        const hashedPassword =  bcrypt.hashSync(userDetails.password, saltRounds);
        let newUser = await User.create({
            name: userDetails.name,
            email: userDetails.email,
            phoneNumber: userDetails.phone,
            password: hashedPassword
        })
        res.json({flag: true, msg: "User created"})
    }else{
        
        res.json({flag: false, msg: "user already exists"})
    }
}


exports.postLogin = async(req,res,next)=>{

    const email = req.body.email
    const password = req.body.password

    let users = await User.findAll({where:{email: email}})

    if(users.length>0){
        const dbid = users[0].id
        const dbpass = users[0].password
        const dbname = users[0].name
        const dbemail = users[0].email

        const match = await bcrypt.compare(password, dbpass)

        if(match){
            const token = jwt.sign(dbid, process.env.TOKEN_SECRET)
            
            return res.status(200).json({msg:'Login successful', token: token, email: dbemail, name: dbname })
        }else{
            return res.status(401).json({msg: 'User not autorized'})
        }
    }else{
        res.status(404).json({msg: 'User not found'})
    }
}
