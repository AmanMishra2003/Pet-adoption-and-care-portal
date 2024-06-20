const express = require('express');
const path = require('path');
const session = require('express-session')
const flash = require('connect-flash')
const { indiaData } = require('./seeds/citydata')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const passport = require('passport')
const asyncHandler = require('express-async-handler')
const LocalStrategy = require('passport-local')
require('dotenv').config()

//model
const petModel = require('./model/pet-model.js')
const vetmodel = require('./model/vet_model')
const appointment_model = require('./model/appointment_model');
const blogmodel = require('./model/blog_model');
const reviewmodel = require('./model/review_model');
const User = require('./model/users');
const Adoption = require('./model/adoption')
const Admin = require('./model/adminModel')



const { transporter } = require('./mail/mail.js');
const { subjectClinic, templateClinic } = require('./mail/mailTemplateClinic.js');
const { subjectPatient, templatePatient } = require('./mail/mailTemplatePatient.js');
const { createPdf } = require('./mail/attachments/coversion.js')
const {isLoggedIn} = require('./middleware.js')


//routes
const userRouter = require('./routes/usersRouter.js')
const eventRouter = require('./routes/eventsRouter.js')
const profileRouter = require('./routes/profileRouter.js')
const adminRouter = require('./routes/adminRouter.js')
const adminProfileRouter = require('./routes/adminprofileRouter.js')
const adoptionRouter = require('./routes/adoptionRouter.js')
const vetRouter = require('./routes/vetRouter.js')
const blogRouter = require('./routes/blogRouter.js')
const reviewRouter = require('./routes/reviewRouter.js');
const donateRouter = require('./routes/donationRouter.js');





const app = express()
const port = 3000;

const sessionConfig = {
    secret: 'thisissomekey',
    resave: false,
    saveUninitialized: true,
}

app.engine('ejs', ejsMate)
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded());
app.use(methodOverride('_method'))
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(async (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.set('views', path.join(__dirname, 'views'))
mongoose.connect("mongodb://localhost:27017/animal").then(() => {
    console.log("connection establish!!")
}).catch((err) => {
    console.log(err)
})


app.use('/profile', profileRouter)
app.use('/events', eventRouter)
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/admin/profile', adminProfileRouter)
app.use('/adopt', adoptionRouter)
app.use('/vet', vetRouter)
app.use('/blog', blogRouter)
app.use('/blog/:id', reviewRouter)
app.use('/donate', donateRouter)










// app.put('/blog/voteUpdate/:id', async(req,res)=>{
//     const {vote} = req.body
//     const {id} = req.params
//     const data = await blogmodel.findByIdAndUpdate(id, vote, {runValidation:true, new:true})
//     // res.redirect(`/blog/${data.id}`)
//     res.send("hello world")
// })

// app.use('*',(req,res)=>{
//     res.render('404')
// })


app.use((err,req,res,next)=>{
    // console.log(err)
    // const {status=400} = err;
    res.render('error',{err})
})

app.listen(port, () => {
    console.log("listening to port 3000!")
})
