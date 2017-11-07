let mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

let roomSchema = mongoose.Schema({
/*
RoomStyle: Link to RoomStyle
RoomNumber: Integer,
isAvailable: Boolean
*/

roomStyle: {
     type: String,
     required: true
    // enum: ['Standard Single', 'Superior Twin', 'Deluxe Double', 'Family Suite',]
  }
  ,

    reserved: [
         {
             from: String,
             to: String
         }
     ]

})

let Room = module.exports = mongoose.model('Room', roomSchema);
