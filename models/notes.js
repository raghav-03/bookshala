const mongoose = require('mongoose');
const multer=require('multer');
const path=require('path');
const notes_path=path.join('/uploads/books/notes');
const notesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    notes:{
        type:String
    },
}, {
    timestamps: true
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'..',notes_path));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

notesSchema.statics.uploadednotes=multer({storage:storage}).single('notes');
notesSchema.statics.notespath=notes_path;
const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes;