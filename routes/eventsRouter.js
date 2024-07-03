const express  = require('express')
const asyncHandler = require('express-async-handler')
const {storage1, cloudinary} = require('../cloudinary/index.js')
const multer = require('multer')

const router = express.Router();


// models
const Event = require('../model/event_model.js')
const User = require('../model/users.js')

//middleware
const {isLoggedIn,ValidateEvent} = require('../middleware.js')
const upload = multer({storage:storage1})

router.get('/',asyncHandler(async (req,res,next)=>{
    const data = await Event.find().populate("author")
    const date = new Date()
    let News = ""
    if(data){
        data.forEach(async(ele)=> {
            if(ele.date < date){
                let events = ele.author.events
                await User.findByIdAndUpdate(ele.author, {$pull :{events : ele._id }})
                await cloudinary.uploader.destroy(ele.img.filename)
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
    const clientId = process.env.PAYPAL_CLIENT_ID
    res.render('events/new',{clientId})
})

router.post('/',isLoggedIn,upload.single('image'),ValidateEvent,asyncHandler(async (req,res,next)=>{
    console.log(req.body)
    console.log(req.file)
    const newEvent =  new Event(req.body)
    // console.log(req.body)
    if(req.file){
        newEvent.img = {
            filename : req.file.filename,
            path : req.file.path
        }
    }
    const user = await User.findOne(req.user)
    newEvent.author = user
    user.events.push(newEvent)
    await newEvent.save()
    await user.save()
    res.redirect('/events')
}))

module.exports = router