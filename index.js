const express = require('express');
const path = require('path');
const {indiaData} = require('./citydata')
const ejsMate = require('ejs-mate')
const app = express()
const port  = 3000;

app.engine('ejs', ejsMate)
app.use(express.static('public'))
app.set('view engine', 'ejs')
// app.use('views', path.join(__dirname,'views'))
app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/Adopt',(req,res)=>{
    const state = Object.keys(indiaData.states);
    const cities = Object.keys(indiaData.cities);
    console.log(state)
    console.log(cities)
    res.render('dogs',{state,cities})
})

app.get('/aboutDog/1',(req,res)=>{
    res.render("Dogo-adopt")
})

app.use('*',(req,res)=>{
    res.render('404')
})

app.listen(port, ()=>{
    console.log("listening to port 3000!")
})
