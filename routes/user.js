const express = require('express')
const userController = require('../controllers/user')
const authanticate = require('../middleware/authenticate')

const router = express.Router()
router.get('/forgotpassword', function(req,res) {
    res.render('forgotpassword',{pageTitle:'Resetpassword',layout:false});

});
router.get('/signup', function(req,res) {
    res.render('signup',{pageTitle:'Signup',layout:false});

});
router.post('/signup', userController.postSignup)

router.post('/login', userController.postLogin)
router.get('/login', function(req,res) {
    res.render('login',{pageTitle:'Login',layout:false});

});
router.get('/home',function(req,res) {
    res.render('home');

});


module.exports = router