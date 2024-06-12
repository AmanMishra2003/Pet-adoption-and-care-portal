const mongoose =require('mongoose')
const Event = require('../model/event_model');


mongoose.connect("mongodb://localhost:27017/animal").then(()=>{
    console.log("connection establish!!")
}).catch((err)=>{
    console.log(err)
})

let img = {
    1:'https://i.pinimg.com/564x/40/d1/72/40d172e12aafa3327b6c84ae7c305d8c.jpg',
    2: 'https://i.pinimg.com/736x/49/26/84/4926843c1928ae266d1e53171e8bce20.jpg',
    3:'https://i.pinimg.com/474x/da/55/75/da55758983293ce93423baf5a8843d58.jpg'
}
const seedDatabase = async()=>{
    await Event.deleteMany({});
    for(let i=0;i<10;i++){
        const detail = new Event({
            img:img[Math.floor(Math.random()*3)+1],
            name : 'Event_name',
            date: new Date('2025-07-13'),
            author:'664c9765c799fac51a4d9a68'
        })
        await detail.save()
    }
}

seedDatabase().then(()=>{
    mongoose.connection.close()
})