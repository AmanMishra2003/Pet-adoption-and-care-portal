const express = require('express');


const router = express.Router()

router.get('/', (req, res) => {
    res.render('donate/donate.ejs')
})

module.exports = router