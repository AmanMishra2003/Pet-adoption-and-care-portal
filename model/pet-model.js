const mongoose  = require('mongoose')
const {imageSchema} =require('./imageSchema')

const Schema = mongoose.Schema

const petDetailSchema = Schema({
    name: {
        type:String,
        required:true
    },
    gender: {
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    image: imageSchema,
    age: {
        type:Number,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    state: {
        type:String,
        required:true
    },
    owner_detail:{
        name: {
            type:String,
            required:true
        },
        number: {
            type:String,
            required:true
        },
        address: {
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },
    social_media_links:{
        instagram:{
            type:String,
            // required:true
        },
        whatsapp:{
            type:String,
            // required:true
        },
        linkedin:{
            type:String,
            // required:true
        },
        twitter:{
            type:String,
            // required:true
        },
    },
    posted_on: {
        type:Date,
        required:true
    },
    img : [imageSchema],
    facts:{
        breed:{
            type:String,
            required:true
        },
        vaccinated:{
            type:String,
            required:true
        },
        neutered:{
            type:String,
            required:true
        }
    },
    info:{
        information:[{
            type:String,
            required:true
        }]
    },
    story:{
        description:{
            type:String,
            required:true
        }
    },
    additional_adoption_info:{
        description:{
            type:String,
            required:true
        }
    },
    isApproved: {
        type:Boolean,
        default:false
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    applicants:[{
        type:Schema.Types.ObjectId,
        ref:'Adoption'
    }]
})



module.exports = mongoose.model('petModel', petDetailSchema)