const mongoose = require('mongoose');
const multer=require('multer');
const path=require('path');
const book_path=path.join('/uploads/books/image');
const sellSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    bookname:{
        type:String,
        required:true
    },
    mrp:{
        type:Number,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    pickup:{
        type:String,
        required:true
    },
    available:{
        type:String,
        required:true
    },    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    image:{
        type:String
    },
    drop:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
}, {
    timestamps: true
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'..',book_path));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

sellSchema.statics.uploadedimage=multer({storage:storage}).single('image');
sellSchema.statics.bookpath=book_path;
const Sell = mongoose.model('Sell', sellSchema);

module.exports = Sell;