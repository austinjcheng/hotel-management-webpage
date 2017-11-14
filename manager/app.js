
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');




// Set up mongoose connection
let mongoose = require('mongoose');
/*
let mongoDB = 'mongodb://cecs445:csulb@ds117485.mlab.com:17485/hotel_app';

mongoose.connect(mongoDB, {
  useMongoClient: true
});
*/


mongoose.Promise = global.Promise;

mongoose.connect(config.database, {
  useMongoClient: true
});

let db = mongoose.connection;

// Check DB connection
db.once('open', function(){
  console.log('Connected to MongoDB'); // Look for this log in the terminal after starting node server
})
// Check for DB errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Init app
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// https://github.com/expressjs/body-parser
// Express/Connect top-level generic

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  /*
  Setting a global variable called messages to the express-messages module.
  */
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// passport config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// create global user variable. asterisk means for all routes
app.get('*', function(req, res, next){
  res.locals.user = req.user || null; // req.user(if login) or null (if not login)
  next(); // next calls the next route or next piece of middleware
 });



 //Bring in Models
 let ReservationFromModel = require('./models/reservation');
 let RoomFromModel = require('./models/room');



app.get('/', function(req, res){
//res.send('hi world');
//res.render('layoutNavBar');
//res.render('signUpNowHomePage');
res.render('layout');
});






// Route files
let reservations = require('./routes/reservations'); // Include our reservations.js file from 'routes' folder.
app.use('/reservations', reservations); // For anything that goes to /reservations, it's gonna go to the reservation.js file

let employees = require('./routes/employees');
app.use('/employees', employees);

let rooms = require('./routes/rooms');
app.use('/rooms', rooms);


app.post('/deleteRSVP', function(req, res){
  console.log("7779");


ReservationFromModel.findById(req.body, function(e, docs){

  RoomFromModel.findOneAndUpdate(

    {
    room_number: docs.roomNum,
    reserved: {
      $elemMatch: {from: docs.startDate, to: docs.endDate}
    }
  }, {$pull: {"reserved" : {from: docs.startDate, to: docs.endDate}}}, function(e, room){
    //console.log(docs);
  //  res.json(room);
  ReservationFromModel.deleteOne(req.body, function(e, docs){
  });


  });


});


res.redirect('/delete_RSVP_Helper');

});

app.get('/delete_RSVP_Helper', function(req, res){
  res.redirect('/reservations/rsvp');
});


// Start server
app.listen(3001, function(){
  console.log('server started on port 3001');
});
