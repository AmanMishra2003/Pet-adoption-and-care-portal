const express = require('express');
const asyncHandler = require('express-async-handler')
const { indiaData } = require('../seeds/citydata.js')

const router = express.Router()

// models
const petModel = require('../model/pet-model.js');
const User = require('../model/users.js');

// middleware
const {isLoggedIn} = require('../middleware.js')

router.get('/', async (req, res) => {
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

router.get('/addpet',isLoggedIn, (req, res) => {
    res.render('adopt/addpet.ejs')
})

router.get('/:id', asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const data = await petModel.findById(id)
    // console.log(data)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${data.posted_on.getDate()} ${monthNames[data.posted_on.getMonth()]} ${data.posted_on.getFullYear()} `
    const right = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="green" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>'
    const wrong = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>'
    res.render("adopt/dog-details", { data, right, wrong, date })
}))


router.get('/:id/edit',isLoggedIn, asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await petModel.findById(id)
    res.render('adopt/editpet.ejs', { data })
}))

router.post('/',isLoggedIn,asyncHandler(async (req,res,next) => {
    const data = new petModel({ ...req.body, posted_on: new Date() });
    const user = await User.findOne(req.user);
    data.author = user;
    user.pets.push(data)
    await data.save();
    await user.save();
    req.flash('success', 'Pet Details Send To Admin For Review')
    res.redirect('/addpet')
}))

router.put('/:id',isLoggedIn, asyncHandler(async (req,res) => {
    const { id } = req.params
    await petModel.findByIdAndUpdate(id, { ...req.body, isApproved: false }, { runValidations: true, new: true })
    req.flash('success', 'Update Complete, Pet Details Send To Admin For Review')
    res.redirect(`/profile`)
}))
router.delete('/:id',isLoggedIn,asyncHandler(async(req,res,next) => {
    const { id } = req.params
    const pet = await petModel.findById(id)
    const user = await User.findOne(req.user)
    user.pets.pull(pet)
    await petModel.findByIdAndDelete(id)
    req.flash('error', 'Delete Complete!')
    res.redirect(`/profile`)
}))

router.get('/:id/adoptapplication',isLoggedIn, asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    res.render('adopt/adoptionApplication.ejs', { id })
}))
router.post('/adoptapplication',isLoggedIn,asyncHandler(async (req,res,next) => {
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

module.exports = router