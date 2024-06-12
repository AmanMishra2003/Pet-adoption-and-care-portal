const mongoose  = require('mongoose')
const passportLocalMongoose  = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = Schema({
    role:{
        type:String,
        default:'user'
    },
    profile:{
        type:Schema.Types.ObjectId,
        ref:'Profile'
    },
    pets:[  
        {
            type:Schema.Types.ObjectId,
            ref:'petModel'
        } 
    ],
    blog:[
        {
            type:Schema.Types.ObjectId,
            ref:'blogmodel'
        }
    ],
    events:[
        {
            type:Schema.Types.ObjectId,
            ref:'Event'
        }
    ]
})
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)