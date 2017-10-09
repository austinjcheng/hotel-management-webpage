var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index.html', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup.html', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

router.get('/login.html', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/adduser', function(req,res){
  var db = req.db;
  var username = req.body.username;
  var useremail = req.body.email;
  var password = req.body.password;
  var collection = db.get('guest');
  collection.insert({
    "username":username,
    "email":useremail,
    "password":password
  }, function (err,doc){
    if(err){
      console.log("Failed to create new user")}
      else{
      res.redirect("/index.html");
    }
  });
});
/*
router.post('/login', function(req,res){
  console.log("1");
  var db = req.db;
  console.log("2");
  //var username = req.body.username;
  var useremail = req.body.email;
  console.log("3");
  var password = req.body.password;
console.log("4");
  var collection = db.get('guest');
console.log("5");
  collection.findOne({
    email:useremail}).exec(function(err, user){
      console.log("5.5");
      if (err){
        console.log("6");
        return callback(err)
      } else if(!user){
        console.log("7");
        var err = new Error('User not Found');
        err.status = 401;
        return callback(err);
      }
    });
    console.log("8");
    res.redirect("/index.html");
  });
*/

module.exports = router;
