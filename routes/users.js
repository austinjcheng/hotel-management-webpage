var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register form
router.get('/register', function(req, res){
  res.render('register');
});

// Login Form
router.get('/login', function(req, res){
//  res.send('heya login');
  res.render('login');
});




module.exports = router;
