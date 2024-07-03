const { string } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

imageSchema = Schema({
    filename:String,
    path:String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.path.replace('/upload','/upload/w_200')
})

module.exports = {imageSchema}
