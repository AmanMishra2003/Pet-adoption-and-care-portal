const mongoose  = require('mongoose')
const {imageSchema} = require('./imageSchema')
const Schema = mongoose.Schema

const vetSchema = Schema({
    img:imageSchema,
    name: {
        type:String,
        required:[true,'name is required Field' ]
    },
    clinicName: {
        type:String,
        required:[true,'clinicName is required Field' ]
    },
    specialist: {
        type:String,
        required:[true,'specialist is required Field' ]
    },
    qualification: {
        type:String,
        required:[true,'qualification is required Field' ]
    },
    exp: {
        type: Number,
        required:[true,'exp is required Field' ]
    },
    clinicAddress: {
        type:String,
        required:[true,'clinicAddress is required Field' ]
    },
    state: {
        type:String,
        required:[true,'state is required Field' ]
    },
    city:{
        type:String,
        required:[true,'city is required Field' ]
    },
    email:{
        type:String,
        required:[true,'email is required Field' ]
    },
    clinicNumber: {
        type:String,
        required:[true,'clinicNumber is required Field' ]
    },
    operatingHour: {
        start: {
            type:Number,
            required:[true,'Operating Hour Start is required Field' ]
        },
        end: {
            type:Number,
            required:[true,'Operating Hour End is required Field' ]
        }
    }
})

module.exports = mongoose.model('vetmodel', vetSchema)