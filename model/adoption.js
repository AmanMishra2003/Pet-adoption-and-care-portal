const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = Schema({
    name : {
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    pet:{
        type:Schema.Types.ObjectId,
        ref:'petModel'
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    description:{
        type:String,
        required:true
    },
    isApproved:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Adoption',appointmentSchema)