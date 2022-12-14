var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var proprties = require('./properties');
var mongoose = require('mongoose');

mongoose.connect(
  proprties.DB_URL, 
  () => {
    console.log("Connected to database")
  }, 
  e => console.error(e)
);
var userModel = require('./models/user.model');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { string } = require('i/lib/util');

var app = express();
app.use(cors(
{
  origin: "http://localhost:3001",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
}
));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
