const { required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = Schema({
    rating:{
        type:Number,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('reviewmodel', reviewSchema)