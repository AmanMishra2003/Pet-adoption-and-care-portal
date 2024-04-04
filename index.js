const express = require('express');
const path = require('path');
const {indiaData} = require('./seeds/citydata')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const dogModel = require('./model/dog-model')
const app = express()
const port  = 3000;

app.engine('ejs', ejsMate)
app.use(express.static('public'))
app.set('view engine', 'ejs')
// app.use('views', path.join(__dirname,'views'))
mongoose.connect("mongodb://localhost:27017/animal").then(()=>{
    console.log("connection establish!!")
}).catch((err)=>{
    console.log(err)
})

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/adopt',async(req,res)=>{
    const param = req.query
    // console.log(param)
    const obj = {}
    for(let x in param){
        if(param[x]){
            obj[x]=param[x]
        }
    }
    // console.log(obj)
    

    const details = await dogModel.find({...obj}).limit(7)
    // console.log(details)
    const state = Object.keys(indiaData.states);
    const cities = Object.keys(indiaData.cities);
    // console.log(state)
    // console.log(cities)
    res.render('dogs',{state,cities, details, obj})
})

// app.get("/filter",(req,res)=>{
//     console.log(req.params)
//     res.send(req.params)
// })

app.get('/aboutDog/1',(req,res)=>{
    res.render("Dogo-adopt")
})

app.use('*',(req,res)=>{
    res.render('404')
})

app.listen(port, ()=>{
    console.log("listening to port 3000!")
})
