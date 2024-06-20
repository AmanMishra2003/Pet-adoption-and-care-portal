const express = require('express');
const asyncHandler = require('express-async-handler')


const router = express.Router()

// models
const blogmodel = require('../model/blog_model');
const User = require('../model/users');

// middleware
const {isLoggedIn} = require('../middleware.js')

router.get('/', asyncHandler(async (req,res,next)=> {
    const data = await blogmodel.find({})
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

router.post('/',isLoggedIn,asyncHandler(async (req,res,next) => {
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

router.get('/:id',asyncHandler(async (req,res,next) => {
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

router.get('/:id/edit',isLoggedIn,asyncHandler(async (req,res,next) => {
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

router.put('/:id',isLoggedIn,asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const blog = await blogmodel.findByIdAndUpdate(id, { ...req.body, isApproved: false }, { runValidations: true, new: true })
    req.flash('success','Update Complete!, Blog Send To Review')
    res.redirect(`/profile`)
}))

router.delete('/:id',isLoggedIn,asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const blog = await blogmodel.findById(id)
    const user = await User.findOne(req.user)
    user.blog.pull(blog)
    await blogmodel.findByIdAndDelete(id)
    res.redirect('/blog')
}))


module.exports = router