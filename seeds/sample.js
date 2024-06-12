const mongoose =require('mongoose')
const petModel = require('../model/pet-model');
// const { name } = require('ejs');

mongoose.connect("mongodb://localhost:27017/animal").then(()=>{
    console.log("connection establish!!")
}).catch((err)=>{
    console.log(err)
})


const seedDatabase = async()=>{
    await petModel.deleteMany({});
    for(let i=0;i<10;i++){
        const detail = new petModel({
            name : "dogo",
            gender: "Male",
            type: "Dog",
            image: "https://source.unsplash.com/collection/483251",
            age:10,
            city : "Delhi",
            state : "Delhi",
            owner_detail:{
                name : "ramesh",
                number : 9822321221,
                address: "Dehradun, Uttarakhand"
            },
            social_media_links:{
                instagram:"https://www.instagram.com/",
                whatsapp:"https://www.instagram.com/",
                linkedin:"https://www.instagram.com/",
                twitter:"https://www.instagram.com/",
            },
            posted_on: new Date(),
            img : ['/images/huskey.png','/images/dog.jpeg'],
            facts:{
                bread: "Golden Retreiver",
                vaccinated:"Yes",
                neutered:"No"
            },
            info:{
                information:['Spayed',"Shots Up to Date","Good with Kids"]
            },
            story:{
                description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem ipsum quibusdam quo eius, sed ex neque laboriosam voluptatibus vitae corporis."
            },
            additional_adoption_info:{
                description:"She is in good health and is very sensitive . Will pull at the sleeve to communicate"
            },
            author:'664c8afde858b4ee3bee208a'
        })

        await detail.save()
    }
}

seedDatabase().then(()=>{
    mongoose.connection.close()
})