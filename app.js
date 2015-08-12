/* Declare variables */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* Add & connect to mongoDB database */
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/express_website_chII');
mongoose.connect('mongodb:https://github.com/anuradhaw/express_website_chII');

var db = require('./model/db');
var client = require('./model/clients');

var routes = require('./routes/index');
var clients = require('./routes/clients');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', clients);

/*app.use(function(req,res,next){
	//res.cookie=('allowed','yes',  { expires: new Date(Date.now() + 900000), httpOnly: true });
	var cookie = req.cookies.allowed;
	if (cookie == null){
		var err = new Error('Cookie "allowed" is not set to yes');
		err.status= 404;
		next(err);
	}
	else{
		app.use('/', clients);
		
		
	}
	next();
});*/



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
