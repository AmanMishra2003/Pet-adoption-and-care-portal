const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router()

//model
const User = require('../model/users');
const Profile = require('../model/profile');
const Pet = require('../model/pet-model');
const Adoption = require('../model/adoption');

//module
const  {transporter} = require('../mail/mail.js');
const  {template} = require('../mail/adoptionApplicationTemplate.js');
const {isLoggedIn} = require('../middleware.js')


router.get('/',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const user = await User.findOne(req.user).populate('profile').populate('pets').populate('events').populate('blog');
    console.log(user)
    res.render('profile/profile.ejs',{user})
}))

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('profile/addprofile.ejs')
})

router.post('/new',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const profileData = new Profile(req.body);
    await profileData.save();
    console.log(profileData)
    const user = await User.findOne(req.user);
    user.profile = profileData;
    await user.save();
    // console.log(user)
    req.flash('success','Profile Added!!')
    res.redirect('/profile')
}))

router.get('/:id/edit',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const {id} = req.params
    const data = await Profile.findById(id)
    res.render('profile/editprofile.ejs',{data})
}))

router.put('/:id',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    await Profile.findByIdAndUpdate(id, req.body, {runValidation:true,new:true})
    res.redirect('/profile')
}))

router.get('/petrequest',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const user = await User.findOne(req.user).populate('pets')
    const pets = user.pets;
    res.render('profile/petrequest.ejs',{pets})
}))

router.get('/:id/applicants',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const {id} = req.params
    const pet = await Pet.findById(id).populate('applicants')
    const applications = pet.applicants
    res.render('profile/petrequestApplications.ejs',{applications})
}))

router.patch('/:id/applicants/approve',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const {id} = req.params
    const applicant = await Adoption.findById(id).populate('pet').populate('author')
    const pet = await Pet.findById(applicant.pet._id).populate('applicants')
    const html  = await template(applicant.name ,applicant.pet.name, applicant.pet.age, applicant.pet.facts.breed, applicant.pet.owner_detail.name, applicant.pet.owner_detail.email, applicant.pet.owner_detail.number )
    const mailOption = {
        from:'petMatch@gmail.com',
        to: 'mishraaman2021@gmail.com',//applicant.email
        subject:`Approval For Pet **${applicant.pet.name}** `,
        html: html
    }

    await transporter.sendMail(mailOption,function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    await Adoption.findByIdAndUpdate(id,{isApproved:true},{runValidation:true,new:true})
    // console.log(applicant)
    applicant.isApproved = true;
    pet.applicants.pull(applicant)
    await applicant.save();
    await pet.save()
    req.flash('success', `Approval mail Send to ${applicant.email} `)
    res.redirect(`/profile/${applicant.pet._id}/applicants`)
}))

router.patch('/:id/applicants/decline',isLoggedIn,asyncHandler(async (req,res,next)=>{
    const {id} = req.params
    const applicant = await Adoption.findById(id).populate('pet').populate('author')
    const pet = await Pet.findById(applicant.pet._id).populate('applicants')
    pet.applicants.pull(applicant)
    await pet.save()
    req.flash('error', `Approval Decline for Person: ${applicant.name} `)
    res.redirect(`/profile/${applicant.pet._id}/applicants`)
}))

module.exports = router