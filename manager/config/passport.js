const LocalStrategy = require('passport-local').Strategy;
const Employee = require('../models/employee');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use('employee', new LocalStrategy(function(username, password, done){
    // match username
    let query = {username: username};
    Employee.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No employee found'});
      }

      // Match password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null,false, {message: 'Wrong password'});
        }
      })

    })
  })
);


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Employee.findById(id, function(err, user) {
      done(err, user);
    });
  });





} // module.exports(...)
