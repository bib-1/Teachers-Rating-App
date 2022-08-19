var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//function to check if the user is logged in or not
function isAuth(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RateTeacher', user: req.user});
});

//GET handler for login
router.get('/login', (req, res, next) => {
  let messages = req.session.messages || []; //message if not defined will be the empty list
  console.log(messages);
  req.session.messages = []; //clearing the msg after we retrive them
  res.render('login', {title: 'Login Into Your Account', messages: messages}); //render the view
});

//POST handler for login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/teachers',
  failureRedirect: '/login',
  failureMessage: 'Invalid crendentials'
}));

//GET handler for register
router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Create Account'})
});

//POST handler for register
router.post('/register', (req, res, next) => {
  // Create a new user in the database
  User.register( 
    new User({
      username: req.body.username
    }),  // new user object
    req.body.password, // password to be encrypted 
    (err, newUser) => {// callback function to handle the result
      if (err) {
        let messages = err || '';
        console.log(err);
        res.redirect('/register');
      }
      else {
        req.login(newUser, (err) => { // log user in and send them to /teachers
          res.redirect('/teachers');
        });
      }
    }
  );
});

//GET handler for logout. (once th user clicks the logout button)
router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err){
    res.redirect('/login');
  })
});

//GET Handler for github
router.get('/github', passport.authenticate('github', { scope: ['user.email'] }));

//Get handeler for /github/callback 
router.get('/github/callback',
  // if login is not successful
  passport.authenticate('github', { failureRedirect: '/login' }),
  // callback when login is successful
  (req, res, next) => { res.redirect('/teachers') }
);

//GET Handler for google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//Get handeler for /google/callback 
router.get('/google/callback',
  // if login is not successful
  passport.authenticate('google', { failureRedirect: '/login' }),
  // callback when login is successful
  (req, res, next) => { res.redirect('/teachers') }
);


module.exports = router;
