

const mongoose  = require('mongoose')
const reviewmodel = require('./review_model')
const {imageSchema} =require('./imageSchema')
const Schema = mongoose.Schema

const BlogSchema = Schema({
    img:imageSchema,
    title:{
        type:String,
        required:true
    },
    metaTitle:{
        type:String,
        required:true
    },
    heading:{
        type:String,
        required:true
    },
    topic: {
        type:String,
        required:true
    },
    date :{
        type:Date,
        required:true
    },
    blog:{
        type:String,
        required:true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'reviewmodel'
        }
    ],
    isApproved: {
        type:Boolean,
        default:false
    }

})

BlogSchema.post('findOneAndDelete',async(blog)=>{
    if(blog){
        await reviewmodel.deleteMany({
            _id :{
                $in: blog.reviews
            }
        })
    }
})

module.exports = mongoose.model('blogmodel', BlogSchema)