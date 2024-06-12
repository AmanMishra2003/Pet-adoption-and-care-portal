const mongoose = require('mongoose')
const Schema = mongoose.Schema



const eventSchema = Schema({
    name : {
        type: String,
        required: true
    },
    img:{
        type: String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    price:{
        type:Number
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})





module.exports = mongoose.model('Event', eventSchema)