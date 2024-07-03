const express = require('express')
const asyncHandler = require('express-async-handler')
const multer = require('multer')
const router = express.Router();

//models
// const User = require('../model/users');
const Profile = require('../model/profile.js');
const Event = require('../model/event_model.js');
const Pet = require('../model/pet-model.js');
const Blog = require('../model/blog_model.js');
const User = require('../model/users.js');
const Vet = require('../model/vet_model.js');

//modules
const  {transporter} = require('../mail/mail.js');
const  {template} = require('../mail/templateApprovalAndDecline.js');
const {isLoggedInAdmin,ValidateProfile, ValidateVet, doesProfileExist, doesVetExist } = require('../middleware.js');
const { cloudinary, storage2 } = require('../cloudinary/index.js');
const upload = multer({storage:storage2})



router.get('/',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const user = await User.findOne(req.user).populate('profile')
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

router.post('/new',isLoggedInAdmin,ValidateProfile,asyncHandler(async (req,res,next)=>{
    const profileData = new Profile(req.body);
   
    // console.log(profileData)
    const admin = await User.findOne(req.user);
    admin.profile = profileData;
    await profileData.save();
    await admin.save();
    // console.log(user)
    req.flash('success','Profile Added!!')
    res.redirect('/admin/profile')
}))

router.get('/:id/edit',isLoggedInAdmin,doesProfileExist,asyncHandler(async (req,res,next)=>{
    const {id} = req.params
    const data = await Profile.findById(id)
    res.render('admin/editprofile',{data})
}))

router.put('/:id',isLoggedInAdmin,doesProfileExist,ValidateProfile,asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    await Profile.findByIdAndUpdate(id, req.body, {runValidation:true,new:true})
    res.redirect('/admin/profile')
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
    // console.log(data)
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
    await cloudinary.uploader.destroy(data.image.filename)
    if(data.img){
      data.img.forEach(async(ele) => {
        await cloudinary.uploader.destroy(ele.filename)
      });
    }
    authorProfile.pets.pull(data)
    await authorProfile.save()
    await data.deleteOne()
    req.flash('error',"Pet Has Been Declined")
    res.redirect('/admin/profile/petapproval')
}))

router.get('/blogapproval',isLoggedInAdmin,asyncHandler(async (req,res,next)=>{
    const data = await Blog.find({isApproved:false}).populate('author')
    // console.log(data)
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
    if(data.img){
      await cloudinary.uploader.destroy(data.img.filename)
    }
    authorProfile.blog.pull(data)
    await authorProfile.save()
    await data.deleteOne()
    req.flash('error',"Blog Has Been Declined")
    res.redirect('/admin/profile/blogapproval')
}))

router.get('/addvet',isLoggedInAdmin,(req,res,next)=>{
    res.render('admin/addVet.ejs')  
})

router.post('/addvet',isLoggedInAdmin,upload.single('imgVet'),ValidateVet,asyncHandler(async(req,res,next)=>{
  // console.log(req.file)
    const vetData = new Vet(req.body)
    if(req.file){
      vetData.img = {
        filename:req.file.filename,
        path:req.file.path
      }
    }
    await vetData.save()
    req.flash('success','Vet added to Database')
    res.redirect('/admin/profile/addvet')
}))

router.get('/allvet',isLoggedInAdmin,asyncHandler(async(req,res,next)=>{
    const vetData = await Vet.find({});
    res.render('admin/allVet.ejs',{vetData})  
}))

router.get('/allvet/:id/edit',isLoggedInAdmin,doesVetExist,asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const vetData = await Vet.findById(id);
    // console.log(vetData)
    res.render('admin/editVet.ejs',{vetData})  
}))

router.put('/allvet/:id',isLoggedInAdmin,doesVetExist,upload.single('imgVet'),ValidateVet,asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const vet = await Vet.findById(id)
    const currentVetImage = vet.img
    const vetData = await Vet.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    if(req.file){
      if(req.file.fieldname==='imgVet'){
        await cloudinary.uploader.destroy(currentVetImage.filename)
        vetData.img = {
          filename: req.file.filename,
          path:req.file.path
        }
      }else{
        vetData.img = currentVetImage
      }
    }
    await vetData.save()
    req.flash('success','Vet Details Updated Successfully')
    res.redirect('/admin/profile/allvet')  
}))
router.delete('/allvet/:id',isLoggedInAdmin,doesVetExist,asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const vetData = await Vet.findById(id);
    if(req.file){
       await cloudinary.uploader.destroy(vetData.img.filename)
    }
    await vetData.deleteOne()
    req.flash('error','Vet Details Deleted')
    res.redirect('/admin/profile/allvet')  
}))


module.exports = router