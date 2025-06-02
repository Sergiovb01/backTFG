const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const dbConection = async() => {

    try{

        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');

    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }

}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 


module.exports = {
    dbConection,
    cloudinary,
}