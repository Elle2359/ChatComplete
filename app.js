require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet=require('helmet')
const path=require('path')
const sequelize = require('./util/database')

const userRoutes = require('./routes/user')
const gropuRoutes = require('./routes/group')
const messageRoutes = require('./routes/message')
const adminRoutes = require('./routes/admin')


const User = require('./models/user')
const Group = require('./models/group')
const Message = require('./models/message')
const userGroup = require('./models/userGroup')


const app = express()

app.set('views', path.join(__dirname, 'fontend'));
app.set('view engine', 'jade');
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(userRoutes)
app.use(gropuRoutes)


app.use(messageRoutes)
app.use(adminRoutes)
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`fontend/${req.url}`))
})
User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });
app.get('/login', function(req,res) {
    res.render('login',{pageTitle:'Login',layout:false});

});
User.hasMany(Message)
Message.belongsTo(User)

sequelize.sync()
.then((res)=>{
    //console.log(res)
    app.listen(3000)
}).catch(err=>console.log(err))