const validationSchema = require('./validateSchema')
const asyncHandler = require('express-async-handler')

// models
const Profile = require('./model/profile')
const Pet = require('./model/pet-model')
const Blog = require('./model/blog_model')
const Vet = require('./model/vet_model')
const Review = require('./model/review_model')

module.exports = {
    isLoggedIn : (req,res,next)=>{
        if(req.isAuthenticated() && req.user && req.user.role=='user'){
            next()
        }else{
            req.session.returnTo = req.originalUrl
            req.flash('error',' You need to be Logged In')
            return res.redirect('/login')
        }
    },
    isLoggedInAdmin:(req,res,next)=>{
        if(req.isAuthenticated() && req.user && req.user.role=='admin'){
            // console.log(req)
            next()
        }else{
            req.session.returnTo = req.originalUrl
            req.flash('error','  Error You need to be Logged In')
            return res.redirect('/admin/login')
        }
    },
    storeReturnTo:(req,res,next)=>{
        if(req.session.returnTo){
            res.locals.returnTo = req.session.returnTo
        }
        next()
    },
    ValidateAdoption:(req,res,next)=>{
        const {error} = validationSchema.adoptionValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message).join(',')
            req.flash('validationError', msg)
            res.redirect(req.originalUrl)
            // req.redirect()
        }else{
            next()
        }
    },
    ValidateAppointment :(req,res,next)=>{
        const {error} = validationSchema.appointmentValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message)
            const redirectUrl = `/vet/${req.body.vet.id}/appointment`
            req.flash('validationError', msg)
            res.redirect(redirectUrl)
        }else{
            next()
        }
    },
    ValidateBlog :(req,res,next)=>{
        const {error} = validationSchema.blogValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message)
            // throw new Error(msg)
            req.flash('validationError', msg)
            if(req.originalUrl==='/blog'){
                res.redirect('/blog/new')
            }else{
                const redirectUrl = req.originalUrl.split('?')[0]+'/edit'
                res.redirect(redirectUrl)
            }
        }else{
            next()
        }
    },
    ValidateEvent :(req,res,next)=>{
        const {error} = validationSchema.eventValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message)
            req.flash('validationError', msg)
            res.redirect('/events/new')
        }else{
            next()
        }
    },
    ValidatePet :(req,res,next)=>{
        const {error} = validationSchema.petValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message)
            req.flash('validationError', msg)
            
            if(req.originalUrl==='/adopt'){
                res.redirect('/adopt/addpet')
            }else{
                const redirectUrl = req.originalUrl.split('?')[0]+'/edit'
                res.redirect(redirectUrl)
            }
        }else{
            next()
        }
    },
    ValidateProfile :(req,res,next)=>{
        const {error} = validationSchema.profileValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message)
            req.flash('validationError', msg)
            
            if(req.originalUrl==='/profile'){
                res.redirect('/profile/new')
            }else if(req.originalUrl.includes('/admin/profile/')){
                const redirectUrl = req.originalUrl.split('?')[0]+'/edit'
                res.redirect(redirectUrl)
            }else if(req.originalUrl==='/admin/profile'){
                res.redirect('/admin/profile/new')
            }else{
                const redirectUrl = req.originalUrl.split('?')[0]+'/edit'
                res.redirect(redirectUrl)
            }
        }else{
            next()
        }
    },
    ValidateReview :(req,res,next)=>{
        const {error} = validationSchema.reviewValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message)
            req.flash('validationError', msg)
            res.redirect(req.originalUrl.replace('/reviews',''))
        }else{
            next()
        }
    },
    ValidateVet :(req,res,next)=>{
        const {error} = validationSchema.vetValidationSchema.validate(req.body)
        if(error){
            const msg = error.details.map(ele=>ele.message)
            req.flash('validationError', msg)
            if(req.originalUrl==='/admin/profile/addvet'){
                res.redirect(req.originalUrl)
            }else{
                res.redirect(req.originalUrl.split('?')[0]+'/edit')
            }
        }
    },
    doesProfileExist : asyncHandler(async(req,res,next)=>{
        const data = await Profile.findById(req.params.id)
        if(!data){
          req.flash('error','Profile Do not exist for the current Admin')
          return res.redirect('/admin/profile')
        }else{
          next()
        }
    }),
    doesPetExist : asyncHandler(async(req,res,next)=>{
        const data = await Pet.findById(req.params.id)
        if(!data){
          req.flash('error',"Pet doesn't Exist")
          return res.redirect('/adopt')
        }else{
          next()
        }
    }),
    doesBlogExist : asyncHandler(async(req,res,next)=>{
        const data = await Blog.findById(req.params.id)
        if(!data){
          req.flash('error',"Blog doesn't Exist")
          return res.redirect('/blog')
        }else{
          next()
        }
    }),
    doesVetExist : asyncHandler(async(req,res,next)=>{
        const data = await Vet.findById(req.params.id)
        if(!data){
          req.flash('error',"Vet doesn't Exist")
          return res.redirect('/vet')
        }else{
          next()
        }
    }),
    isReviewAuthor : asyncHandler(async(req,res,next)=>{
        const review = await Review.findById(req.params.reviewId)
        if(!review.author.equals(req.user._id)){
            req.flash('error',"You Don't Have Permission")
            return res.redirect(`/blog/${req.params.id}`)
        }
        next()
    }),
    isPetAuthor : asyncHandler(async(req,res,next)=>{
        const {id} = req.params;
        const pet = await Pet.findById(id)
        if(!pet.author.equals(req.user._id)){
            req.flash('error',"You Don't Have Permission")
            return res.redirect(`/adopt`)
        }
        next()
    }),
    isBlogAuthor : asyncHandler(async(req,res,next)=>{
        const {id} = req.params;
        const blog = await Blog.findById(id)
        if(!blog.author.equals(req.user._id)){
            req.flash('error',"You Don't Have Permission")
            return res.redirect(`/blog`)
        }
        next()
    }),
}