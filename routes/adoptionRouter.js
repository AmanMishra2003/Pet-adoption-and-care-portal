const express = require('express');
const asyncHandler = require('express-async-handler')
const { indiaData } = require('../seeds/citydata.js')
const {storage2, cloudinary} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage:storage2})

const router = express.Router()

// models
const petModel = require('../model/pet-model.js');
const User = require('../model/users.js');
const Adoption = require('../model/adoption.js')

// middleware
const {isLoggedIn, ValidateAdoption,ValidatePet, doesPetExist,isPetAuthor} = require('../middleware.js')


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

router.get('/:id',doesPetExist, asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const data = await petModel.findById(id).populate('applicants')
    // console.log(data)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${data.posted_on.getDate()} ${monthNames[data.posted_on.getMonth()]} ${data.posted_on.getFullYear()} `
    const right = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="green" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>'
    const wrong = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>'
    res.render("adopt/dog-details", { data, right, wrong, date })
}))


router.get('/:id/edit',isLoggedIn,doesPetExist,isPetAuthor, asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await petModel.findById(id)
    res.render('adopt/editpet.ejs', { data })
}))

router.post('/',isLoggedIn,upload.fields([{name:'image'},{name:'img'}]),ValidatePet,asyncHandler(async (req,res,next) => {
    const data = new petModel({ ...req.body, posted_on: new Date() });
    if(req.files){
        if(req.files.image){
            data.image =req.files.image.map(ele=>({filename:ele.filename, path:ele.path}))[0]
        }
        if(req.files.img){
            data.img = req.files.img.map(ele=>({filename:ele.filename, path:ele.path}))
        }
    }
    const user = await User.findOne(req.user);
    data.author = user;
    user.pets.push(data)
    await data.save();
    await user.save();
    req.flash('success', 'Pet Details Send To Admin For Review')
    res.redirect('/adopt/addpet')
}))

router.put('/:id',isLoggedIn,doesPetExist,isPetAuthor,upload.fields([{name:'image'},{name:'img'}]),ValidatePet, asyncHandler(async (req,res) => {
    console.log(req.body)
    const { id } = req.params
    const pet = await petModel.findById(id)
    const currentProfilePhoto = pet.image;
    const UpdatedPetDetails =  await petModel.findByIdAndUpdate(id, { ...req.body, isApproved: false }, { runValidations: true, new: true })
   
    if(req.body.deleteImages){
        req.body.deleteImages.forEach(async(ele)=>{
            await cloudinary.uploader.destroy(ele)
        })
        await UpdatedPetDetails.updateOne({$pull : {img : {filename : {$in : req.body.deleteImages}}}})
    }
    if(req.files){
        if(req.files.image){
            await cloudinary.uploader.destroy(currentProfilePhoto.filename)
            UpdatedPetDetails.image =req.files.image.map(ele=>({filename:ele.filename, path:ele.path}))[0]
        }else{
            UpdatedPetDetails.image = currentProfilePhoto
        }

        if(req.files.img){
            let newImages = req.files.img.map(ele=>({filename : ele.filename , path :ele.path}))
            UpdatedPetDetails.img.push(...newImages)
        }
    }
    await UpdatedPetDetails.save()
    req.flash('success', 'Update Complete, Pet Details Send To Admin For Review')
    res.redirect(`/profile`)
}))
router.delete('/:id',isLoggedIn,doesPetExist,isPetAuthor,asyncHandler(async(req,res,next) => {
    const { id } = req.params
    const pet = await petModel.findById(id)
    const user = await User.findOne(req.user)
    if(pet.image){
        await cloudinary.uploader.destroy(pet.image.filename)
    }
    if(pet.img){
        pet.img.forEach(async(ele) => {
            await cloudinary.uploader.destroy(ele.filename)
        });
    }
    user.pets.pull(pet)
    await user.save()
    await petModel.findByIdAndDelete(id)
    req.flash('error', 'Delete Complete!')
    res.redirect(`/profile`)
}))

router.get('/:id/adoptapplication',isLoggedIn, asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    res.render('adopt/adoptionApplication.ejs', { id })
}))
router.post('/:id/adoptapplication',isLoggedIn,doesPetExist,ValidateAdoption,asyncHandler(async (req,res,next) => {
    const {name, age, email, phone, address, description } = req.body;
    const user = await User.findOne(req.user);
    const pet = await petModel.findById(req.params.id)
    // console.log(req.body)
    // console.log(pet)
    const application = new Adoption({
        name: name,
        age: age,
        address: address,
        email: email,
        phone: phone,
        pet: pet._id,
        author: user,
        description: description
    })
    pet.applicants.push(application)
    await application.save()
    await pet.save()
    req.flash('success', 'Application Successfully Send!')
    res.redirect(`/adopt/${pet._id}`)
}))

module.exports = router