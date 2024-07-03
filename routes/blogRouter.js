const express = require('express');
const asyncHandler = require('express-async-handler')

const multer = require('multer')



const router = express.Router()

// models
const blogmodel = require('../model/blog_model');
const User = require('../model/users');

// middleware
const {isLoggedIn,ValidateBlog, doesBlogExist,isBlogAuthor} = require('../middleware.js');
const { storage2, cloudinary } = require('../cloudinary/index.js');
const upload = multer({storage:storage2})

router.get('/', asyncHandler(async (req,res,next)=> {
    const data = await blogmodel.find({isApproved:true})
    res.render('blog/blogPage.ejs', { data })
}))

router.get('/new',isLoggedIn, (req, res) => {
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

router.post('/',isLoggedIn,upload.single('imgBlog'),ValidateBlog,asyncHandler(async (req,res,next) => {
    const body = req.body;
    const data = new blogmodel(body)
    const user = await User.findOne(req.user)
    if(req.file){
        data.img = {
            filename:req.file.filename,
            path:req.file.path
        }
    }
    data.date = new Date()
    data.author = user
    user.blog.push(data);
    await data.save()
    await user.save();
    req.flash('success', 'Your Blog has been send to Review')
    res.redirect(`/blog/new`)

}))

router.get('/:id',doesBlogExist,asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await blogmodel.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
    // console.log(data)
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

router.get('/:id/edit',isLoggedIn,doesBlogExist,isBlogAuthor,asyncHandler(async (req,res,next) => {
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

router.put('/:id',isLoggedIn,doesBlogExist,isBlogAuthor,upload.single('imgBlog'),ValidateBlog,asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const b = await blogmodel.findById(id)
    const currentBlogImage = b.img
    const blog = await blogmodel.findByIdAndUpdate(id, { ...req.body, isApproved: false }, { runValidations: true, new: true })
    if(req.file){
        if(req.file.fieldname==='imgBlog'){
            await cloudinary.uploader.destroy(currentBlogImage.filename)
            blog.img = {
                filename:req.file.filename,
                path:req.file.path
            }
        }else{
            blog.img = currentBlogImage
        }
    }
    await blog.save()
    req.flash('success','Update Complete!, Blog Send To Review')
    res.redirect(`/profile`)
}))

router.delete('/:id',isLoggedIn,doesBlogExist,isBlogAuthor,asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const blog = await blogmodel.findById(id)
    const user = await User.findOne(req.user)
    if(blog.img){
        await cloudinary.uploader.destroy(blog.img.filename)
    }
    user.blog.pull(blog)
    await user.save()
    await blogmodel.findByIdAndDelete(id)
    res.redirect('/profile')
}))


module.exports = router