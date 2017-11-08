let mongoose = require('mongoose');
let moment = require('moment');

var Schema = mongoose.Schema;

var LoomSchema = mongoose.Schema ({
    room_number: Number,
    roomstyle: String,
    reserved: [
        {
            from: String,
            to: String
        }
    ]
});

let Loom = module.exports = mongoose.model('Loom', LoomSchema);
