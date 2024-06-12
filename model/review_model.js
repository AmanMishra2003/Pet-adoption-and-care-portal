const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = Schema({
    rating:{
        type:Number
    },
    body:{
        type:String
    }
})

module.exports = mongoose.model('reviewmodel', reviewSchema)