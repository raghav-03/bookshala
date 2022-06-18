const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
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
    }
}, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;