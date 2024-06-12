const mongoose =require('mongoose')
const vetmodel = require('../model/vet_model');
const { name } = require('ejs');

mongoose.connect("mongodb://localhost:27017/animal").then(()=>{
    console.log("connection establish!!")
}).catch((err)=>{
    console.log(err)
})


const seedDatabase = async()=>{
    await vetmodel.deleteMany({});
    for(let i=0;i<10;i++){
        const detail = new vetmodel({
            img:'https://i.pinimg.com/474x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg',
            name: 'Dr.Dheeraj',
            clinicName: 'Vetic Pet Clinic',
            specialist: 'Dermatology',
            qualification: 'Bachelor of Veterinary Science (BVSc)',
            exp: '5',
            clinicAddress: 'Ground Floor, 3, Gallaria Pillar No-52, Plot No-3C, Sector 49, Noida, Uttar Pradesh 201301',
            state: 'Delhi',
            city:'Delhi',
            email:'mishraaman2021@gmail.com',
            clinicNumber:'8812221201',
            operatingHour: {
                start: 9,
                end:19
            }
        })
        await detail.save()
    }
}

seedDatabase().then(()=>{
    mongoose.connection.close()
})