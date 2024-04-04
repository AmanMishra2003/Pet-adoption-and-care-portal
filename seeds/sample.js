const mongoose =require('mongoose')
const dogModel = require('../model/dog-Model');
const { name } = require('ejs');

mongoose.connect("mongodb://localhost:27017/animal").then(()=>{
    console.log("connection establish!!")
}).catch((err)=>{
    console.log(err)
})


const seedDatabase = async()=>{
    await dogModel.deleteMany({});
    for(let i=0;i<10;i++){
        const detail = new dogModel({
            name : "dogo",
            gender: "Male",
            type: "Dog",
            image: "https://source.unsplash.com/collection/483251",
            age:10,
            city : "Delhi",
            state : "Delhi",
            owner_detail:{
                name : "ramesh",
                number : 9822321221
            },
            social_media_links:{
                instagram:"https://www.instagram.com/",
                whatsapp:"https://www.instagram.com/",
                linkedin:"https://www.instagram.com/",
                twitter:"https://www.instagram.com/",
            }
        })
        await detail.save()
    }
}

seedDatabase().then(()=>{
    mongoose.connection.close()
})