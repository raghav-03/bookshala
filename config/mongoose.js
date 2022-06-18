//require the library
const mongoose = require('mongoose');

//connect to the database
const mongourl=process.env.db
mongoose.connect(mongourl || 'mongodb://localhost/bookshala_db',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//acquire the connection(to check if it's successful)   
const db = mongoose.connection;

//error
db.on('error', function(err) {
     console.log(err.message); 
});

//up and running then print the message
db.once('open', function() {
    console.log("Successfully connected to the database Learner");
});

module.exports=db;