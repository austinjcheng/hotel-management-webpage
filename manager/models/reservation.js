let mongoose = require('mongoose');

// Reservation Schema
let reservationSchema = mongoose.Schema({
  guest: {
    type: String,
    required: true
  },
  roomstyle: {
    type: String,
    required: true
  },
});

let Reservation = module.exports = mongoose.model('Reservation', reservationSchema);
