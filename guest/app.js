
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



// Bring in Models
/**  let ReservationFromModel = require('./models/reservations');  */

app.get('/', function(req, res){
//res.send('hi world');
//res.render('layoutNavBar');
//res.render('signUpNowHomePage');
res.render('layout');
});





/* -----
// Home route
app.get('/', function(req,res){
   ReservationFromModel.find({}, function(err, reservationsVar){ // find all reservations with an empty curly brace {}
      if(err){
        console.log(err);
      } else {
        // render the template
        res.render('index', {
          title: 'Rooms Reserved',
          reservations: reservationsVar
        });
    }
  });
})

*/
// Route files
let reservations = require('./routes/reservations'); // Include our reservations.js file from 'routes' folder.
app.use('/reservations', reservations); // For anything that goes to /reservations, it's gonna go to the reservation.js file

let users = require('./routes/users');
app.use('/users', users);


let UserFromModel = require('./models/user');
let ReservationFromModel = require('./models/reservation');
let RoomFromModel = require('./models/room');
let LoomFromModel = require('./models/loom')


app.get('/userJSON', function(req, res){
  //res.send('hi userJSON');

   UserFromModel.find({},{},function(e,docs){
       res.json(docs);
   });
});

app.get('/reservationJSON', function(req, res){

   ReservationFromModel.find({},{},function(e,docs){
       res.json(docs);
   });
});

app.get('/roomJSON', function(req, res){

   RoomFromModel.find({},{},function(e,docs){
       res.json(docs);
   });
});

app.get('/resFilteredJSON', function(req, res){

  ReservationFromModel.find(
  //  {roomstyle: 'Standard Single'}
  {endDate:  {"$lte": new Date("2017-11-11")} }

  ,function(e,docs){
      res.json(docs);
  });
});


// https://www.joshmorony.com/building-a-hotel-booking-app-with-ionic-2-mongodb-node/



/*
 * Generate some test data, if no records exist already
 * MAKE SURE TO REMOVE THIS IN PROD ENVIRONMENT
*/

/*

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




LoomFromModel.remove({}, function(res){
    console.log("removed records");
});

LoomFromModel.count({}, function(err, count){
    console.log("Rooms: " + count);

    if(count === 0){

        var recordsToGenerate = 40;

        // enum: ['Standard Single', 'Superior Twin', 'Deluxe Double', 'Family Suite',]

        var roomTypes = [
            'Standard Single',
            'Superior Twin',
            'Deluxe Double',
            'Family Suite'
        ];

        // For testing purposes, all rooms will be booked out from:
        // 18th May 2017 to 25th May 2017, and
        // 29th Jan 2018 to 31 Jan 2018

        for(var i = 1; i <= recordsToGenerate + 1; i++){

          if(i < 10){
            var newRoom = new LoomFromModel({
                room_number: i,
                roomstyle: roomTypes[0],
                reserved: [
                    {from: '8/22/2017', to: '8/26/2017'},
                    {from: '11/22/2017', to: '11/26/2017'},
                    {from: '1/2/2018', to: '1/6/2018'}
                ]
            });
          } else if( i >= 10 && i <  20){
            var newRoom = new LoomFromModel({
                room_number: i,
                roomstyle: roomTypes[1],
                reserved: [
                {from: '8/22/2017', to: '8/26/2017'},
                {from: '11/22/2017', to: '11/26/2017'},
                {from: '1/2/2018', to: '1/6/2018'}
                ]
            });
          } else if (i >= 21 && i < 30){
            var newRoom = new LoomFromModel({
                room_number: i,
                roomstyle: roomTypes[2],
                reserved: [
                {from: '8/22/2017', to: '8/26/2017'},
                {from: '11/22/2017', to: '11/26/2017'},
                {from: '1/2/2018', to: '1/6/2018'}
                ]
            });
          } else if ( i >= 30){
            var newRoom = new LoomFromModel({
                room_number: i,
                roomstyle: roomTypes[3],
                reserved: [
                {from: '8/22/2017', to: '8/26/2017'},
                {from: '11/22/2017', to: '11/26/2017'},
                {from: '1/2/2018', to: '1/6/2018'}
                ]
            });
          }

            newRoom.save(function(err, doc){
                console.log("Created test document: " + doc._id);
            });
        }

    }
});



*/



app.get('/LoomJSON', function(req, res){



  LoomFromModel.find({
        roomstyle: "Deluxe Double",

    //    beds: 4,

      //  max_occupancy: {$gt: 0},

    //    cost_per_night: {$gte: 0, $lte: 499},

        reserved: {

            //Check if any of the dates the room has been reserved for overlap with the requsted dates
            $not: {




//$elemMatch: {from: {$lt: "2017-04-24"}, to: {$gt: "2017-04-19"}}
$elemMatch: {from: {$lt: req.body.enddate}, to: {$gt: req.body.startdate}}

/* returns 0 rooms:
[]

What does a return of 0 rooms mean? Well it means that the 4 rooms are not available for reservation from 4-19-17 to 4-24-17.  4-24-17 is okay, but the days 4-19, 4-20,4-21,4-22, and 4-23 are already reserved for the rooms
*/


          } // not

        } //reserved


    }, function(err, rooms){
        if(err){
            res.send(err);
        } else {
            res.json(rooms);
        }
    });



});



// Start server
app.listen(3002, function(){
  console.log('server started on port 3002');
});
