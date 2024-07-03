const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router({mergeParams:true})

// models
const blogmodel = require('../model/blog_model');
const reviewmodel = require('../model/review_model');
const User = require('../model/users.js')

// middleware
const {isLoggedIn, ValidateReview,isReviewAuthor} = require('../middleware.js')


router.post('/reviews',ValidateReview,asyncHandler(async (req,res,next) => {
    const { id } = req.params;
    const body = req.body;
    const blog = await blogmodel.findById(id)
    const user = await User.findById(req.user)
    const review = new reviewmodel(body.review)
    review.author = user
    blog.reviews.push(review)
    await blog.save()
    await review.save()

    res.redirect(`/blog/${id}`)
}))

router.delete('/reviews/:reviewId',isLoggedIn,isReviewAuthor,asyncHandler(async (req,res,next) => {
    const { id, reviewId } = req.params
    await blogmodel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await reviewmodel.findByIdAndDelete(reviewId)
    res.redirect(`/blog/${id}`)
}))


module.exports = router