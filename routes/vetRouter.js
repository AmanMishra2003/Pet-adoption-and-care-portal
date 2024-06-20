const express = require('express');
const asyncHandler = require('express-async-handler')
const { indiaData } = require('../seeds/citydata.js')

const router = express.Router()

//models
const User = require('../model/users.js');
const vetmodel = require('../model/vet_model')
const appointment_model = require('../model/appointment_model');

// middleware
const {isLoggedIn} = require('../middleware.js')
const { transporter } = require('../mail/mail.js');
const { subjectClinic, templateClinic } = require('../mail/mailTemplateClinic.js');
const { subjectPatient, templatePatient } = require('../mail/mailTemplatePatient.js');
const { createPdf } = require('../mail/attachments/coversion.js')

//Call A Vet
router.get('/',asyncHandler(async (req,res,next) => {
    res.render('vetcall/vethome')
}))

router.get('/vetDetails',asyncHandler(async (req,res,next) => {
    const param = req.query
    const obj = {}
    for (let x in param) {
        if (param[x]) {
            obj[x] = param[x]
        }
    }
    const details = await vetmodel.find({ ...obj }).limit(4)
    const state = Object.keys(indiaData.states);
    const cities = Object.keys(indiaData.cities);
    res.render('vetcall/vets', { state, cities, details, obj })
}))

router.get('/:id/appointment',isLoggedIn, asyncHandler(async (req,res,next) => {
    const { id } = req.params
    const data = await vetmodel.findById(id)
    res.render('vetcall/appointment', { data })
}))

router.post('/appointment/success',isLoggedIn,asyncHandler(async (req,res,next) => {
    const body = req.body;
    console.log(body)
    const user = await User.findById(req.user._id)
    const data = new appointment_model(body)
    data.author = user
    await data.save()
    await createPdf(data, data.id)
    let dateFormat = ""
    if (data.date.getMonth() + 1 < 10) {
        if (data.date.getDate() < 10) {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-0${data.date.getDate()}`
        } else {
            dateFormat = `${data.date.getFullYear()}-0${data.date.getMonth() + 1}-${data.date.getDate()}`
        }
    } else {
        dateFormat = `${data.date.getFullYear()}-${data.date.getMonth() + 1}-${data.date.getDate()}`
    }
    const subject1 = subjectClinic()
    const html1 = templateClinic(data.id, data.name, data.petname, data.vet.clinicName, dateFormat, data.time, data.description)
    const mailOptions1 = {
        from: 'petMatch@gmail.com',
        to: data.vet.vetEmail,
        subject: subject1,
        html: html1
    };

    const subject2 = subjectPatient(data.petname, dateFormat, data.time)
    const html2 = templatePatient(data.id, data.name, data.petname, data.vet.clinicName, dateFormat, data.time, data.vet.name, data.vet.clinicAddress, data.vet.number)
    const mailOptions2 = {
        from: 'petMatch@gmail.com',
        to: data.email,
        subject: subject2,
        html: html2,
        attachments: [
            {
                filename: `${data.id}.pdf`,
                path: `./mail/attachments/pdf/${data.id}.pdf`,
                contentType: 'application/pdf'
            }
        ]
    };

    await transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    await transporter.sendMail(mailOptions1, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.render('vetcall/appointment_success', { data })
}))


module.exports = router