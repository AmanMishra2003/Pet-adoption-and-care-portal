const { localsName } = require('ejs');
const joi = require('joi')


module.exports.adoptionValidationSchema = joi.object({
    name : joi.string().required(),
    age:joi.number().required(),
    address:joi.string().required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone:joi.string().required().pattern(/^[0-9]+$/, 'numbers'),
    description:joi.string().required()
});

module.exports.appointmentValidationSchema=joi.object({
    name:joi.string().required(),
    petname:joi.string().required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    date :joi.date().greater('now').required(),
    time:joi.string().required(),
    animal:joi.string().required(),
    phone:joi.string().required().pattern(/^[0-9]+$/, 'numbers'),
    description:joi.string().required(),
    vet:joi.object({
        id:joi.string().required(),
        name:joi.string().required(),
        clinicName:joi.string().required(),
        vetEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        clinicAddress:joi.string().required(),
        number: joi.string().required(),
    }).required()
});

module.exports.blogValidationSchema = joi.object({
        title:joi.string().required(),
        metaTitle:joi.string().required(),
        heading:joi.string().required(),
        topic:joi.string().required(),
        date:joi.date().greater('now'),
        blog:joi.string().required(),
});

module.exports.eventValidationSchema = joi.object({
    name:joi.string().required(),
    date:joi.date().greater('now').required(),
    price:joi.string()
});

module.exports.petValidationSchema = joi.object({
    name:joi.string().required(),
    gender:joi.string().required(),
    type:joi.string().required(),
    age:joi.number().required(),
    city:joi.string().required(),
    state:joi.string().required(),
    owner_detail:joi.object({
        name:joi.string().required(),
        number:joi.string().required().pattern(/^[0-9]+$/, 'numbers'),
        address:joi.string().required(),
        email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    }).required(),
    facts:joi.object({
                breed:joi.string().required(),
                vaccinated:joi.string().required(),
                neutered:joi.string().required()
    }).required(),
    info:joi.object({
        information:joi.array().items(joi.string().required()).required()
    }).required(),
    story:joi.object({
        description:joi.string().required()
    }).required(),
    additional_adoption_info:joi.object({
        description:joi.string().required()
    }).required(),
});

module.exports.profileValidationSchema = joi.object({
    fname:joi.string().required(),
    lname:joi.string().required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone:joi.string().required().pattern(/^[0-9]+$/, 'numbers'),
});

module.exports.reviewValidationSchema = joi.object({
    review: joi.object({
        rating:joi.number().required().integer(),
        body:joi.string().required()
    }).required()
});

module.exports.vetValidationSchema = joi.object({
    name:joi.string().required(),
    clinicName:joi.string().required(),
    specialist:joi.string().required(),
    qualification:joi.string().required(),
    exp:joi.number().required(),
    clinicAddress:joi.string().required(),
    state:joi.string().required(),
    city:joi.string().required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    clinicNumber:joi.string().required().pattern(/^[0-9]+$/, 'numbers'),
    operatingHour: joi.object({
                start:joi.number().required(),
                end: joi.number().required(),
    }).required()

})













  


