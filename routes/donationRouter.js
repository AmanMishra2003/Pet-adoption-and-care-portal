const express = require('express');


const router = express.Router()

router.get('/', (req, res) => {
    const clientId = process.env.PAYPAL_CLIENT_ID
    res.render('donate/donate.ejs',{clientId})
})

module.exports = router