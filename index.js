const express=require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app=express();
const dotenv=require('dotenv')
app.use(express.urlencoded());
app.use(cookieParser()); 
dotenv.config({path:"config.env"})
const port=process.env.PORT || 3601;

// connecting to database
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const flash=require('connect-flash');
const MongoStore = require('connect-mongodb-session')(session);
const flashmiddleware=require('./config/middleware');
const expressLayouts = require('express-ejs-layouts');
// connecting to veiw engine
app.set('view engine','ejs');
app.set('views','./views');
//connecting to static assets
app.use(express.static('assets'));
app.use(expressLayouts);
// make the uploads path available 
app.use('/uploads',express.static(__dirname+'/uploads'))
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// mongo store is used to store the session cookie in the db
var store = new MongoStore({
    uri: 'mongodb+srv://user:raghav1@cluster0.sjjbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    collection: 'mySessions'
});
store.on('error', function(error) {
    console.log(error);
});
app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(flashmiddleware.setflash);
// connecting to routes
app.use('/',require('./routes/index'));
// fire up the server
app.listen(port,function(err){
    if(err){
        console.log(`Error ${err}`);
        return;
    }
    console.log(`Running fine on port ${port}`);
});