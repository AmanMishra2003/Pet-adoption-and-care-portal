const express  = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router();


// models
const Event = require('../model/event_model')
const User = require('../model/users')

//middleware
const {isLoggedIn} = require('../middleware.js')

router.get('/',asyncHandler(async (req,res,next)=>{
    const data = await Event.find().populate("author")
    const date = new Date()
    let News = ""
    if(data){
        data.forEach(async(ele)=> {
            if(ele.date < date){
                await Event.findByIdAndDelete(ele._id)
            }
        });
        data.reverse()
        News = ""
        res.render('events/eventpage',{News, data})
    }else{
        News = "No Event Currently!"
        res.render('events/eventpage',{News})
    }
    
}))

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('events/new')
})

router.post('/',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const newEvent =  new Event(req.body)
    // console.log(req.body)
    const user = await User.findOne(req.user)
    newEvent.author = user
    user.events.push(newEvent)
    await newEvent.save()
    await user.save()
    res.redirect('/events')
}))

module.exports = router