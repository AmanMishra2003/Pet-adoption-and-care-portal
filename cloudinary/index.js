const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY
})
 
const storage1 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PetMatch/Advertisement',
    allowedFormats : ['png' , 'jpeg', 'jpg']
  },
});

const storage2 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req,file)=>{
        if(file.fieldname==='image'){
            return 'PetMatch/Pet/image'
        }else if(file.fieldname==='img'){
            return 'PetMatch/Pet/images'
        }else if(file.fieldname==='imgBlog'){
            return 'PetMatch/Blog/images'
        }else if(file.fieldname==='imgVet'){
            return 'PetMatch/Vet/images'
        }
    },
    allowedFormats : ['png' , 'jpeg', 'jpg']
  }
});


module.exports = {
    cloudinary,
    storage1,
    storage2
}
 