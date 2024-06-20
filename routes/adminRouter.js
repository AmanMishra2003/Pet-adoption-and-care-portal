const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router();

// const Admin = require('../model/adminModel');
const User = require('../model/users');
const passport = require('passport');

//middleware
const {storeReturnTo} = require('../middleware')



router.get('/login',(req,res)=>{
    res.render('admin/login')
})
router.get('/register',(req,res)=>{
    res.render('admin/register')
})

router.post('/register',asyncHandler(async (req,res,next)=>{
    try{    
        const {username, password} = req.body
        const user = new User({username, role:'admin'})
        const result = await User.register(user, password)
        req.login(result, (err)=>{
            if(err) return next(err)
            res.redirect('/admin/profile')
        })//establish a login session
    }catch(err){
        req.flash('error', err.message)
        res.redirect('/admin/register')
    }    
}))

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/admin/login'}),(req,res)=>{
    const redirectUrl = res.locals.returnTo || '/admin/profile'
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



module.exports = router