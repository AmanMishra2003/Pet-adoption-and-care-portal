module.exports = {
    isLoggedIn : (req,res,next)=>{
        if(req.isAuthenticated() && req.user && req.user.role=='user'){
            // console.log(req)
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
    }
}