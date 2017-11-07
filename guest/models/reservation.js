let mongoose = require('mongoose');
let moment = require('moment');

var Schema = mongoose.Schema;

// Reservation Schema
let reservationSchema = mongoose.Schema({
  roomstyle: {
    type: String,
    required: true
  },
  guest: {
    type: Schema.ObjectId, ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  roomNum: {
    type: Schema.ObjectId, ref: 'Room',
    required: false
  },
  processed: {
    type: String,
    required: false
  }
});

let Reservation = module.exports = mongoose.model('Reservation', reservationSchema);
