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
const userRouter = require('./routes/users.js')
const eventRouter = require('./routes/events.js')
const profileRouter = require('./routes/profile.js')
const adminRouter = require('./routes/admin.js')
const adminProfileRouter = require('./routes/adminprofile.js')



const app = express()
const port = 3000;

const sessionConfig = {
    secret: 'thisissomekey',
    // resave: false,
    // saveUninitialized: true,
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

passport.use('local', new LocalStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())


passport.use('admin', new LocalStrategy(Admin.authenticate()))
// passport.serializeUser(Admin.serializeUser())
// passport.deserializeUser(Admin.deserializeUser())

passport.serializeUser(function (user, done) {
    if (user instanceof User) {
        done(null, user.id);
    } else if (user instanceof Admin) {
        done(null, user.id);
    }
});

passport.deserializeUser(async function (id, done) {
        const user = await User.findById(id)
        if(user){
            done(null, user)
        }else{
            const admin = await Admin.findById(id)
            if(admin){
                done(null,admin);
            }
        }
        
});

app.use(async (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = await User.findOne(req.user);
    res.locals.currentAdmin = await Admin.findOne(req.user);
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

app.get('/', (req, res) => {
    console.log(req.user)
    res.render('home')
})
app.get('/adopt', async (req, res) => {
    const param = req.query
    const obj = {}
    for (let x in param) {
        if (param[x]) {
            obj[x] = param[x]
        }
    }

    const details = await petModel.find({ ...obj,isApproved:true }).limit(5)
    const state = Object.keys(indiaData.states);
    const cities = Object.keys(indiaData.cities);
    res.render('adopt/dogs', { state, cities, details, obj })
})

app.get('/adopt/:id', asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const data = await petModel.findById(id)
    // console.log(data)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${data.posted_on.getDate()} ${monthNames[data.posted_on.getMonth()]} ${data.posted_on.getFullYear()} `
    const right = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="green" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>'
    const wrong = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>'
    res.render("adopt/dog-details", { data, right, wrong, date })
}))

app.get('/addpet',isLoggedIn, (req, res) => {
    res.render('adopt/addpet.ejs')
})
app.get('/adopt/:id/edit',isLoggedIn, asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await petModel.findById(id)
    res.render('adopt/editpet.ejs', { data })
}))

app.post('/adopt',isLoggedIn,asyncHandler(async (req,res,next) => {
    const data = new petModel({ ...req.body, posted_on: new Date() });
    const user = await User.findOne(req.user);
    data.author = user;
    user.pets.push(data)
    await data.save();
    await user.save();
    req.flash('success', 'Pet Details Send To Admin For Review')
    res.redirect('/addpet')
}))

app.put('/adopt/:id',isLoggedIn, asyncHandler(async (req,res) => {
    const { id } = req.params
    await petModel.findByIdAndUpdate(id, { ...req.body, isApproved: false }, { runValidations: true, new: true })
    req.flash('success', 'Update Complete, Pet Details Send To Admin For Review')
    res.redirect(`/profile`)
}))
app.delete('/adopt/:id',isLoggedIn,asyncHandler(async(req,res,next) => {
    const { id } = req.params
    const pet = await petModel.findById(id)
    const user = await User.findOne(req.user)
    user.pets.pull(pet)
    await petModel.findByIdAndDelete(id)
    req.flash('error', 'Delete Complete!')
    res.redirect(`/profile`)
}))

app.get('/adopt/:id/adoptapplication',isLoggedIn, asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    res.render('adopt/adoptionApplication.ejs', { id })
}))
app.post('/adopt/adoptapplication',isLoggedIn,asyncHandler(async (req,res,next) => {
    const { petid, name, age, email, phone, address, description } = req.body;
    const user = await User.findOne(req.user);
    const pet = await petModel.findById(petid)
    const application = new Adoption({
        name: name,
        age: age,
        address: address,
        email: email,
        phone: phone,
        pet: pet,
        author: user,
        description: description
    })
    pet.applicants.push(application)
    await application.save()
    await pet.save()
    req.flash('success', 'Application Successfully Send!')
    res.redirect(`/adopt/${petid}`)
}))

//Call A Vet
app.get('/vet',asyncHandler(async (req,res,next) => {
    res.render('vetcall/vethome')
}))

app.get('/vet/vetDetails',asyncHandler(async (req,res,next) => {
    const param = req.query
    const obj = {}
    for (let x in param) {
        if (param[x]) {
            obj[x] = param[x]
        }
    }
    const details = await vetmodel.find({ ...obj }).limit(4)
    const state = Object.keys(indiaData.states);
    const cities = Object.keys(indiaData.cities);
    res.render('vetcall/vets', { state, cities, details, obj })
}))

app.get('/vet/:id/appointment',isLoggedIn, asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await vetmodel.findById(id)
    res.render('vetcall/appointment', { data })
}))

app.post('/vet/appointment/success',isLoggedIn,asyncHandler(async (req,res,next) => {
    const body = req.body;
    console.log(body)
    const data = new appointment_model(body)
    await data.save()
    await createPdf(data, data.id)
    let dateFormat = ""
    if (data.date.getMonth() + 1 < 10) {
        if (data.date.getDate() < 10) {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-0${data.date.getDate()}`
        } else {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-${data.date.getDate()}`
        }
    } else {
        dateFormat = `${data.date.getFullYear()}-${data.date.getMonth() + 1}-${data.date.getDate()}`
    }
    const subject1 = subjectClinic()
    const html1 = templateClinic(data.id, data.name, data.petname, data.vet.clinicName, dateFormat, data.time, data.description)
    const mailOptions1 = {
        from: 'petMatch@gmail.com',
        to: data.vet.vetEmail,
        subject: subject1,
        html: html1
    };

    const subject2 = subjectPatient(data.petname, dateFormat, data.time)
    const html2 = templatePatient(data.id, data.name, data.petname, data.vet.clinicName, dateFormat, data.time, data.vet.name, data.vet.clinicAddress, data.vet.number)
    const mailOptions2 = {
        from: 'petMatch@gmail.com',
        to: data.email,
        subject: subject2,
        html: html2,
        attachments: [
            {
                filename: `${data.id}.pdf`,
                path: `./mail/attachments/pdf/${data.id}.pdf`,
                contentType: 'application/pdf'
            }
        ]
    };

    await transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    await transporter.sendMail(mailOptions1, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.render('vetcall/appointment_success', { data })
}))

//donate
app.get('/donate', (req, res) => {
    res.render('donate/donate.ejs')
})

//blog
app.get('/blog', asyncHandler(async (req,res,next)=> {
    const data = await blogmodel.find({})
    res.render('blog/blogPage.ejs', { data })
}))

app.get('/blog/new',isLoggedIn, (req, res) => {
    const date = new Date()
    let dateFormat = ""
    if (date.getMonth() + 1 < 10) {
        if (date.getDate() < 10) {
            dateFormat = `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`
        } else {
            dateFormat = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
        }
    } else {
        dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
    res.render('blog/newBlogs.ejs', { dateFormat })
})

app.post('/blog',isLoggedIn,asyncHandler(async (req,res,next) => {
    const body = req.body;
    const data = new blogmodel(body)
    const user = await User.findOne(req.user)
    data.author = user
    user.blog.push(data);
    await data.save()
    await user.save();
    req.flash('success', 'Your Blog has been send to Review')
    res.redirect(`/blog/new`)

}))

app.get('/blog/:id',asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await blogmodel.findById(id).populate('reviews').populate('author')
    let dateFormat = ""
    if (data.date.getMonth() + 1 < 10) {
        if (data.date.getDate() < 10) {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-0${data.date.getDate()}`
        } else {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-${data.date.getDate()}`
        }
    } else {
        dateFormat = `${data.date.getFullYear()}-${data.date.getMonth() + 1}-${data.date.getDate()}`
    }
    res.render('blog/blogDetails.ejs', { data, dateFormat })
}))

app.get('/blog/:id/edit',isLoggedIn,asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await blogmodel.findById(id)
    let dateFormat = ""
    if (data.date.getMonth() + 1 < 10) {
        if (data.date.getDate() < 10) {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-0${data.date.getDate()}`
        } else {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-${data.date.getDate()}`
        }
    } else {
        dateFormat = `${data.date.getFullYear()}-${data.date.getMonth() + 1}-${data.date.getDate()}`
    }
    //   console.log(data)
    res.render('blog/blogediting.ejs', { data, dateFormat })
}))

app.put('/blog/:id',isLoggedIn,asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const blog = await blogmodel.findByIdAndUpdate(id, { ...req.body, isApproved: false }, { runValidations: true, new: true })
    req.flash('success','Update Complete!, Blog Send To Review')
    res.redirect(`/profile`)
}))

app.delete('/blog/:id',isLoggedIn,asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const blog = await blogmodel.findById(id)
    const user = await User.findOne(req.user)
    user.blog.pull(blog)
    await blogmodel.findByIdAndDelete(id)
    res.redirect('/blog')
}))

//blog reviews
app.post('/blog/:id/reviews',asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const body = req.body;
    const blog = await blogmodel.findById(id)
    const review = new reviewmodel(body.review)
    await review.save()
    blog.reviews.push(review)
    await blog.save()

    res.redirect(`/blog/${id}`)
}))

app.delete('/blog/:id/reviews/:reviewId',asyncHandler(async (req,res,next) => {
    const { id, reviewId } = req.params
    await blogmodel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await reviewmodel.findByIdAndDelete(reviewId)
    res.redirect(`/blog/${id}`)
}))





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
