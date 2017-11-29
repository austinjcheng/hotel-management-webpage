const express = require('express');
const router = express.Router();

let ReservationFromModel = require('../models/reservation');
let UserFromModel = require('../models/user');
let RoomFromModel = require('../models/room');
let EmployeeFromModel = require('../models/employee');


router.get('/rooms', ensureAuthenticated, function(req,res){
  //res.send('testR');
  RoomFromModel.find({}).sort([['room_number', 'ascending']]).exec(function(err, roomsVar){
    res.render('rooms', {
      rooms: roomsVar
    });
  });
});
// access control

// logout
router.get('/employees/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/employees/login');
});


function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){ // we can call req.isAuthenticated() because of passport middleware
    return next();
  } else{
    req.flash('danger', 'Please login');
    res.redirect('/employees/login');
  }
}


module.exports = router;
