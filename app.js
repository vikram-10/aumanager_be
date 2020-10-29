var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter=require('./routes/signup');
var loginRouter=require('./routes/login');
var dashboardRouter=require('./routes/dashboard');
var allfacultiesRouter=require('./routes/allfaculties');
var studentfacultyassignRouter=require('./routes/studentfacultyassign');
var taskRouter=require('./routes/tasks');
var studentdoubtsRouter=require('./routes/studentdoubts');
let applicantsRouter=require('./routes/getapplicants');
let facultyClearanceRouter=require('./routes/facultyclearance');
let forumRouter=require('./routes/forum');
let forumCardRouter=require('./routes/forumcard');

var app = express();

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
app.use('/signup',signupRouter);
app.use('/login',loginRouter);
app.use('/dashboard',dashboardRouter);
app.use('/allfaculties',allfacultiesRouter);
app.use('/assign',studentfacultyassignRouter);
app.use('/tasks',taskRouter);
app.use('/studentdoubts',studentdoubtsRouter);
app.use('/applicants',applicantsRouter);
app.use('/facultyclearance',facultyClearanceRouter);
app.use('/forum',forumRouter);
app.use('/forumcard',forumCardRouter)

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
