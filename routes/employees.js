var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let Employee = require('../models/employee');

router.get('/', function(req, res){
  //res.send('test employee');
  res.render('Emp');
});


// Register form
router.get('/register', function(req, res){
  res.render('EmpRegister');
});

// Register process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('EmpRegister', {
      errors: errors
    });
  }  else {
    let newEmployee = new Employee({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newEmployee.password, salt, function(err, hashedPassword){
        if(err){
          console.log(err);
        }
        newEmployee.password = hashedPassword;

        newEmployee.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'Hi new employee, you are now registered and can log in');
            res.redirect('/employees/login');
          }
        })
      });
    });
  }
});




// Login Form
router.get('/login', function(req, res){
  res.render('EmpLogin');
});


// Login process
router.post('/login', function(req, res, next){
  passport.authenticate('employee', {
    successRedirect: '/',
    failureRedirect: '/employees/login',
    failureFlash: true
  })(req, res, next );
});


// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/employees/login');
});



module.exports = router;
