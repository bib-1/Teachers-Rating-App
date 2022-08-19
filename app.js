var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose'); //importing mongoose
var config = require('./config/globals');
var hbs = require('hbs');

//importing passport and mongoose session
var passport = require('passport');
var githubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var session = require('express-session');
var User = require('./models/user'); //importing the user model

var indexRouter = require('./routes/index');
var teachersRouter = require('./routes/teacher'); //creating a router object


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Configuration of passport before the route declation so that it protects them
app.use(session({
  secret: 'teacherRatingApp',
  reset: false,
  setUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//config local strategy > username and passport
passport.use(User.createStrategy()); 
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Configuring github strategy
passport.use(new githubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
},
// Callback function to handle github authentication
async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOne({ oauthId: profile.id });
  if (user) {
    return done(null, user);
  }
  else {
    const newUser = new User({
      username: profile.username,
      oauthId: profile.id,
      oauthProvider: 'Github',
      created: Date.now()
    });
    const savedUser = await newUser.save();
    return done(null, savedUser);
  }
}
));

//configuring google strategy
passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.secret,
  callbackURL: config.google.callback
  },
  async(accessToken, refreshToken, profile, done) =>{
    const user = await User.findOne({ oauthId: profile.id });
    if (user) {
      return done(null, user);
    }
    else {
      const newUser = new User({
        //grabbing the values from google profile
        username: profile.displayName,
        oauthId: profile.id,
        oauthProvider: 'Google',
        created: Date.now()
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  }
  ));


app.use('/', indexRouter);
app.use('/teachers', teachersRouter); //using teachersRouter object on '/teachers' endpoint 

//Connecting to the database

const connectionString = config.db; //getting the credentials from the config file

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((message) => {console.log(`Connected Successfully`);})
  .catch((error) => {console.log(`${error}`);})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
