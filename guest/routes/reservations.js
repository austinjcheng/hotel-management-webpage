const express = require('express');
const router = express.Router();

let ReservationFromModel = require('../models/reservation');

let UserFromModel = require('../models/user');



// Add Route
// Add ensureAuthenticated as a 2nd parameter to protect the add route for logged in users only
router.get('/add', ensureAuthenticated, function(req, res){

  res.render('add_reservation', {
    title: 'Add Reservation'
  });
});


// Add Sumbit POST route
router.post('/add', function(req, res){
  //req.checkBody('roomNum', 'Room Number is required').notEmpty();
  req.checkBody('roomstyle', 'roomstyle is required').notEmpty();
  //req.checkBody('guest', 'Guest is required').notEmpty();
  req.checkBody('startDate', 'Start Date is required').notEmpty();
  req.checkBody('endDate', 'End Date is required').notEmpty();

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
       reservation.startDate = req.body.startDate;
       reservation.endDate = req.body.endDate;

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

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){ // colon is placeholder of anything. anything in this case, is the id.
    ReservationFromModel.findById(req.params.id, function(err, reservationResponse){

        if(reservationResponse.guest != req.user._id){ // put one underscore, not two underscores
          req.flash('danger', 'Not Authorized');
          res.redirect('/');
        }

        res.render('edit_reservation', {
        reservation: reservationResponse,
        // edit_reservation.pug from view has a title, so we need to pass in a title
        title: 'Edit Reservation'
      });
    });
});


// Update Sumbit POST route
router.post('/edit/:id', function(req, res){
  // Not creating a new reservation, so set reservation to an empty object
  let reservation = {};

  reservation.roomstyle = req.body.roomstyle;
  reservation.guest = req.body.guest;
  reservation.startDate = req.body.startDate;
  reservation.endDate = req.body.endDate;

  // create a query to specify which reservation we would like to update
  let query =  {_id: req.params.id}

  // instead of using the reservation variable a few lines above, we're gonna use the model
  ReservationFromModel.update(query, reservation, function(err){  // pass in the query, and the data, which is the object in the reservation variable
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Reservation updated');
      res.redirect('/');
    }
  });
});

// We want to delete a reservation. We want to make a delete request, we can't do that with a single link nor submitting a single form.
// We can only do get and post. So we need to do an AJAX. Use jquery then make simple delete request with AJAX to the delete route
// First, we will create out delete button in reservation.pug. Grab the delete reservation class with jquery. Then we can make our request.
// The file we're gonna use is gonna be in the public folder. Create new folder js in public folder. Then create a new file called main.js, this is basically the client-side javascript file.


router.delete('/:id', function(req, res){
  // AJAX for delete
  if(!req.user._id){
     res.status(500).send();
  }

  let query = {_id: req.params.id}

   ReservationFromModel.findById(req.params.id, function(err, reservation){
       if(reservation.guest != req.user._id){
           res.status(500).send();
       } else {
           ReservationFromModel.remove(query, function(err){
             if(err){
               console.log(err);
             } else {
               // Since we made a request that main.js script, we need to send back a response.
               // So do res.send(), which sends 200 by default, meaning everything is okay.
               res.send('Success');
             }
           });
      }
  });
});



// Get Single Reservation
router.get('/:id', function(req, res){ // colon is placeholder of anything. anything in this case, is the id.
    ReservationFromModel.findById(req.params.id, function(err, reservationResponse){
      UserFromModel.findById(reservationResponse.guest, function(err, user){
         res.render('reservation', {
              reservation: reservationResponse,
               guest: user.name,
         });
      });
    });
});



// access control

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){ // we can call req.isAuthenticated() because of passport middleware
    return next();
  } else{
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}


module.exports = router;
