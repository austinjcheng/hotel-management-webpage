let mongoose = require('mongoose');
let moment = require('moment');

// Reservation Schema
let reservationSchema = mongoose.Schema({
  roomstyle: {
    type: String,
    required: true
  },
  guest: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    require: true
  },
  endDate: {
    type: String,
    require: true
  }
});

let Reservation = module.exports = mongoose.model('Reservation', reservationSchema);


/*
https://medium.com/@micahbales/how-to-programmatically-select-items-in-an-html-dropdown-menu-including-multiple-selections-f1797d0ae268
*/
