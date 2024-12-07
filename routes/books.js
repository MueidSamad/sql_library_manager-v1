const express = require('express');
const router = express.Router();
const { Book } = require('../models');

/* Routes and views */

// Handler function to wrap each route
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// Books Route
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    console.log("Books:", books);
    res.render('index', { books, title: 'Books' });
}));

// New Book Route
router.get('/new', (req, res) => {
    res.render('new-book');
});

module.exports = router;