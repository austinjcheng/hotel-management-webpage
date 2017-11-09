let mongoose = require('mongoose');
let moment = require('moment');

var Schema = mongoose.Schema;

var RoomSchema = mongoose.Schema ({
    room_number: Number,
    roomstyle: String,
    reserved: [{
      from: String,
      to: String
    }]
});

let Room = module.exports = mongoose.model('Room', RoomSchema);
