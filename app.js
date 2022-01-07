const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mysql      = require('mysql');

require("dotenv").config( );

var connection = mysql.createConnection({
  host     : process.env['SQL_HOSTNAME'],
  user     : process.env['SQL_USERNAME'],
  password : process.env['SQL_PASSWORD'],
  database : process.env['SQL_DATABASE']
});

const indexRouter = require('./routes/index');
const v1api = require('./routes/api/v1/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env['SESS_SECRET_KEY'],
  // store:new MongoStore({url:'mongodb://localhost:27017/sessiondb'}),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 6000 * 1000 } //10分鐘到期
 
}));

app.use( (req, res, next) => { // init
  req.session.user = req.session.user || new Object();

  
  connection.on('error', (e) => {
    console.log( e );
    setTimeout(()=>3000, connection.connect);
  });
  
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error){
      console.log(`Error: ${error['ECONNREFUSED']}`);
      req.sql = {
        error: error
      };
    }else{
      req.sql = connection;
    }
    next( );

  });
  
  // return next( );
})

app.use('/', indexRouter);
app.use('/api/v1', v1api);

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
