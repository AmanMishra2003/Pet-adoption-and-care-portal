

const mongoose  = require('mongoose')

const Schema = mongoose.Schema

const appointments = Schema({
    name:{
        type:String,
        required:true
    },
    petname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    date :{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    animal:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    vet :{
        id:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        clinicName:{
            type:String,
            required:true
        },
        vetEmail:{
            type:String,
            required:true
        },
        clinicAddress:{
            type:String,
            required:true
        },
        number: {
            type:String,
            required:true
        },
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

})

module.exports = mongoose.model('appointment', appointments)