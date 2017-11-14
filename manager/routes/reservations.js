const express = require('express');
const router = express.Router();

let ReservationFromModel = require('../models/reservation');
let UserFromModel = require('../models/user');
let RoomFromModel = require('../models/room');
let EmployeeFromModel = require('../models/employee');


// Reservation route
router.get('/rsvp', ensureAuthenticated, function(req,res){
  //http://mongoosejs.com/docs/2.7.x/docs/populate.html
   ReservationFromModel.find({}).sort([['startDate', 'ascending']]).populate('guest', ['username']).exec(function(err, reservationsVar){ // find all reservations with an empty curly brace {}
      if(err){
        console.log(err);
      } else {
        // render the template
        console.log('3434');
        console.log(reservationsVar);
        res.render('reservation', {
          title: 'Reservation List',
          reservations: reservationsVar,
        });



    }
  });
});

// Add Route
// Add ensureAuthenticated as a 2nd parameter to protect the add route for logged in users only
router.get('/add', ensureAuthenticated, function(req, res){

  res.render('add_reservation', {
    title: 'Add Reservation'
  });
});


// Add Sumbit POST route
router.post('/add', function(req, res){
  req.checkBody('roomNum', 'Room Number is required').notEmpty();
  //req.checkBody('guest', 'Guest is required').notEmpty();

  // Get Errors
    let errors = req.validationErrors();

    if(errors){
       res.render('add_reservation', {
       title: 'Add Reservation',
       errors: errors
       });
     } else {

       let reservation = ReservationFromModel();
       reservation.roomstyle = req.body.roomstyle;
       reservation.guest = req.user._id;
       //reservation.guest = req.user.name;

       reservation.save(function(err){
         if(err){
           console.log(err);
           return;
         } else {
           req.flash('success', 'Reservation added');
           res.redirect('/');
         }
       });
     }



});

router.post('/deleteRSVP', function(req, res){
  console.log("77d9");


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


res.redirect('/reservations/delete_RSVP_Helper');

});

router.get('reservations/delete_RSVP_Helper', function(req, res){
  res.redirect('/reservations/rsvp');
});

router.get('/delete_RSVP_Helper', function(req, res){
  res.redirect('/reservations/rsvp');
});











// logout
router.get('/employees/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/employees/login');
});

// access control

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){ // we can call req.isAuthenticated() because of passport middleware
    return next();
  } else{
    req.flash('danger', 'Please login');
    res.redirect('/employees/login');
  }
}


module.exports = router;
