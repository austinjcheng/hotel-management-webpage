const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Employee = require('../models/employee')
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use('user', new LocalStrategy(function(username, password, done){
    // match username
    let query = {username: username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
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


passport.use('employee', new LocalStrategy(function(username, password, done){
  // match username
  let query = {username: username};
  Employee.findOne(query, function(err, emp){
    if(err) throw err;
    if(!emp){
      return done(null, false, {message: 'No employee found'});
    }

    // Match password
    bcrypt.compare(password, emp.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, emp);
      } else {
        return done(null,false, {message: 'Wrong Employee password'});
      }
    })

  })
})
);

/*

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
*/

// Multiple "local" strategies #50
// https://github.com/jaredhanson/passport/issues/50

passport.serializeUser(function(user, done) {
  var key;
  if(user instanceof User) {
        key = {
            id: user.id,
            type: 1
        }
    } else if (user instanceof Employee) {
        key = {
            id: user.id,
            type: 2
        }
    }
  done(null, key);
});

passport.deserializeUser(function(key, done) {
      if(key.type === 1){
          User.findById(key.id, function(err, user) {
              done(err, user);
          });
      } else if (key.type === 2){
          Employee.findById(key.id, function(err, user) {
              done(err, user);
          });
      }
  });


// https://stackoverflow.com/questions/44576864/one-of-strategies-used-in-passportjs-do-not-return-user-object


} // module.exports(...)
