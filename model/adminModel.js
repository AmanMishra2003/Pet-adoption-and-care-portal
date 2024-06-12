const mongoose  = require('mongoose')
const passportLocalMongoose  = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const adminSchema = Schema({
    role:{
        type:String,
        default:'admin'
    },
    profile:{
        type:Schema.Types.ObjectId,
        ref:'Profile'
    }
})
adminSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Admin', adminSchema)