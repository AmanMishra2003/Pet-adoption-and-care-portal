const mongoose  = require('mongoose')

const Schema = mongoose.Schema;

const profileSchema = Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
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
    }
})


module.exports = mongoose.model('Profile', profileSchema)