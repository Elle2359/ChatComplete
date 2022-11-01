const express = require('express')
const router=express.Router()
const messageController=require('../controllers/message')
const authenticateController = require('../middleware/authenticate')


router.post('/addMessage',authenticateController.authenticateToken,messageController.addMessage)
router.get('/getMessages',authenticateController.authenticateToken,messageController.getMessages)
module.exports=router