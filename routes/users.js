var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Login Form
router.get('/login', function(req, res){
//  res.send('heya login');
  res.render('login');
});

module.exports = router;
