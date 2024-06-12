const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router();

const Admin = require('../model/adminModel');
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
        const user = new Admin({username})
        const result = await Admin.register(user, password)
        req.login(result, (err)=>{
            if(err) return next(err)
            res.redirect('/admin/profile')
        })//establish a login session
    }catch(err){
        req.flash('error', err.message)
        res.redirect('/admin/register')
    }    
}))

router.post('/login',storeReturnTo,passport.authenticate('admin',{failureFlash:true,failureRedirect:'/admin/login'}),(req,res)=>{
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