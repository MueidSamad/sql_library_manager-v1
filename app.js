var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Import the Sequelize models (from models/index.js)
var db = require('./models');
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// Sync database before starting the app

(async () => {
  await db.sequelize.sync({ force: false });
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view cache', false);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// 404 error handler for nonexistent routes
app.use((req, res, next) => {
  res.status(404).render('page_not_found', { title: 'Page Not Found' })
});

// Global handler for other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('page_not_found', { title: 'Page Not Found' });
  } else {
    res.render('error', { title: 'Error', error: err });
  }
});

module.exports = app;