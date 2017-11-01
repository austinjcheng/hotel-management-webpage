let mongoose = require('mongoose');
var moment = require('moment');

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
  startDate: {
    type: Date,
    require: true
  },
  endDate: {
    type: Date,
    require: true
  }
});


reservationSchema
.virtual('start_date_formatted')
.get(function () {
  return moment(this.startDate).format('MMMM Do, YYYY');
});


reservationSchema
.virtual('end_date_formatted')
.get(function () {
  return moment(this.endDate).format('MMMM Do, YYYY');
});

let Reservation = module.exports = mongoose.model('Reservation', reservationSchema);
