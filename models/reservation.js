let mongoose = require('mongoose');

// Reservation Schema
let reservationSchema = mongoose.Schema({
  roomNum: {
    type: String,
    required: true
  },
  guest: {
    type: String,
    required: true
  }
});

let Reservation = module.exports = mongoose.model('Reservation', reservationSchema);
