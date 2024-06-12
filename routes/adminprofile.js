const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router();

//models
const Admin = require('../model/adminModel');
const Profile = require('../model/profile');
const Event = require('../model/event_model');
const Pet = require('../model/pet-model');
const Blog = require('../model/blog_model');
const User = require('../model/users');
const Vet = require('../model/vet_model');

//modules
const  {transporter} = require('../mail/mail');
const  {template} = require('../mail/templateApprovalAndDecline');
const {isLoggedInAdmin} = require('../middleware.js')

router.get('/',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const user = await Admin.findOne(req.user).populate('profile')
    const petCount = await Pet.find({isApproved:true}).count()
    const eventCount = await Event.find({}).count()
    const blogCount = await Blog.find({isApproved:true}).count()
    const vetCount = await Vet.find({}).count()
    const CountArr = [petCount,eventCount,blogCount,vetCount]
    res.render('admin/profile.ejs',{user,CountArr})
}))
router.get('/new',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    res.render('admin/addprofile.ejs')
}))

router.post('/new',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const profileData = new Profile(req.body);
   
    // console.log(profileData)
    const admin = await Admin.findOne(req.user);
    admin.profile = profileData;
    await profileData.save();
    await admin.save();
    // console.log(user)
    req.flash('success','Profile Added!!')
    res.redirect('/admin/profile')
}))

router.get('/:id/edit',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const {id} = req.params
    const data = await Profile.findById(id)
    res.render('admin/editprofile',{data})
}))

router.put('/:id',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    await Profile.findByIdAndUpdate(id, req.body, {runValidation:true,new:true})
    res.redirect('/profile')
}))

router.get('/event',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const {date} = req.query;
    const filterdata = date || new Date()
    const event = await Event.find({date : filterdata})
    // console.log(event)
    res.render('admin/events',{event})
}))

router.get('/petapproval',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const data = await Pet.find({isApproved:false})
    console.log(data)
    res.render('admin/petApproval',{data})
}))

router.patch('/:id/petapproval/approve',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const data = await Pet.findById(id)
    const authorProfile = await User.findById(data.author._id).populate('profile')
    data.isApproved = true;
    data.save();
    const html  = await template(authorProfile.username ,'Approved',`You can visit your Pet Post page http://localhost:3000/adopt/${id}`  )
    const mailOption = {
        from:'petMatch@gmail.com',
        to: 'mishraaman2021@gmail.com',//authorProfile.profile.email
        subject:`Approval For PetMatch `,
        html: html
    }

    await transporter.sendMail(mailOption,function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    req.flash('success',"Pet Has Been Approved")
    res.redirect('/admin/profile/petapproval')
}))

router.patch('/:id/petapproval/decline',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const data = await Pet.findById(id);
    const authorProfile = await User.findById(data.author._id).populate('profile')
    const html  = await template(authorProfile.username ,'Decline',`We regret to inform that we do not find your Pet Post relevent and Follow our guidelines. Best of luck for the future!! `  )
    const mailOption = {
        from:'petMatch@gmail.com',
        to: 'mishraaman2021@gmail.com',//authorProfile.profile.email
        subject:`Approval For PetMatch `,
        html: html
    }

    await transporter.sendMail(mailOption,function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    await data.deleteOne()
    req.flash('error',"Pet Has Been Declined")
    res.redirect('/admin/profile/petapproval')
}))

router.get('/blogapproval',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const data = await Blog.find({isApproved:false}).populate('author')
    console.log(data)
    res.render('admin/blogApproval',{data})
}))

router.patch('/:id/blogapproval/approve',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const data = await Blog.findById(id).populate('author')
    const authorProfile = await User.findById(data.author._id).populate('profile')
    data.isApproved = true;
    data.save();
    const html  = await template(authorProfile.username ,'Approved',`You can visit your blog page http://localhost:3000/blog/${id}`  )
    const mailOption = {
        from:'petMatch@gmail.com',
        to: 'mishraaman2021@gmail.com',//authorProfile.profile.email
        subject:`Approval For PetMatch `,
        html: html
    }

    await transporter.sendMail(mailOption,function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    req.flash('success',"Blog Has Been Approved")
    res.redirect('/admin/profile/blogapproval')
}))

router.patch('/:id/blogapproval/decline',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{

    const {id} = req.params;
    const data = await Blog.findById(id);
    const authorProfile = await User.findById(data.author._id).populate('profile')
    const html  = await template(authorProfile.username ,'Decline',`We regret to inform that we do not find your Blog relevent and usefull. Best of luck for the future!! `  )
    const mailOption = {
        from:'petMatch@gmail.com',
        to: 'mishraaman2021@gmail.com',//authorProfile.profile.email
        subject:`Approval For PetMatch `,
        html: html
    }

    await transporter.sendMail(mailOption,function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    await data.deleteOne()
    req.flash('error',"Blog Has Been Declined")
    res.redirect('/admin/profile/blogapproval')
}))

router.get('/addvet',isLoggedInAdmin,(req,res,next)=>{
    res.render('admin/addVet.ejs')  
})

router.post('/addvet',isLoggedInAdmin,asyncHandler(async(req,res,next)=>{
    const vetData = new Vet(req.body)
    await vetData.save()
    req.flash('success','Vet added to Database')
    res.redirect('/admin/profile/addvet')
}))

router.get('/allvet',isLoggedInAdmin,asyncHandler(async(req,res,next)=>{
    const vetData = await Vet.find({});
    res.render('admin/allVet.ejs',{vetData})  
}))

router.get('/allvet/:id/edit',isLoggedInAdmin,asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const vetData = await Vet.findById(id);
    console.log(vetData)
    res.render('admin/editVet.ejs',{vetData})  
}))

router.put('/allvet/:id',isLoggedInAdmin,asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const vetData = await Vet.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    req.flash('success','Vet Details Updated Successfully')
    res.redirect('/admin/profile/allvet')  
}))
router.delete('/allvet/:id',isLoggedInAdmin,asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const vetData = await Vet.findByIdAndDelete(id);
    req.flash('error','Vet Details Deleted')
    res.redirect('/admin/profile/allvet')  
}))


module.exports = router