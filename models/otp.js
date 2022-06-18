const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    admin:{
        type:String,
        required:true
    },
    donated:{
        type:String,
        required:true
    },
    requestername: {
        type: String
    },
    requesternumber:{
        type:String
    },
    bookname:{
        type:String
    },
    otp:{
        type:String,
        required: true
    }
}, {
    timestamps: true
});


const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;