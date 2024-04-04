const mongoose  = require('mongoose')

const Schema = mongoose.Schema

const dogDetailSchema = Schema({
    name: String,
    gender: String,
    type:String,
    image: String,
    age: Number,
    city: String,
    state: String,
    owner_detail:{
        name: String,
        number: Number
    },
    social_media_links:{
        instagram:String,
        whatsapp:String,
        linkedin:String,
        twitter:String,
    }
})

module.exports = mongoose.model('dogModel', dogDetailSchema)