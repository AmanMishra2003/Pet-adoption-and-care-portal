const express = require('express');
const asyncHandler = require('express-async-handler')
const router = express.Router();

//model
const User = require('../model/users');
const passport = require('passport');

//middleware
const {storeReturnTo} = require('../middleware')



router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',asyncHandler(async (req,res,next)=>{
    try{    
        const {username, password} = req.body
        const user = new User({username, role:'user'})
        const result = await User.register(user, password)
        req.login(result, (err)=>{
            if(err) return next(err)
            res.redirect('/profile')
        })//establish a login session
    }catch(err){
        req.flash('error', err.message)
        res.redirect('/register')
    }    
}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    const redirectUrl = res.locals.returnTo || '/profile'
    res.redirect(redirectUrl)
})


router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        res.redirect('/')
    })
})


router.get('/', (req, res) => {
    res.render('home')
})

module.exports = router;