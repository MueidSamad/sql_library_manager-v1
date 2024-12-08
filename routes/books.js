var express = require('express');
const { render } = require('../app');
var router = express.Router();
const { Book } = require('../models');
const { Op } = require('sequelize');

// Handler function to wrap each route
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

// Full list of books with optional search
router.get('/', asyncHandler(async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const whereCondition = query ? {
        [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { author: { [Op.like]: `%${query}%` } },
            { genre: { [Op.like]: `%${query}%` } },
            { year: { [Op.like]: `%${query}%` } }
        ]
    } : {};

    const { count, rows: books } = await Book.findAndCountAll({
        where: whereCondition,
        limit,
        offset
    });

    const totalPages = Math.ceil(count / limit);

    res.render('index', {
        books,
        title: 'Books',
        totalPages,
        currentpage: page,
        query
    });
}));

// New Book 
router.get('/new', (req, res) => {
    res.render('new-book', { title: "New Book" });
});

// Create Book 
router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        console.log('Submitted: ' + book.title);
        res.redirect('/books/' + book.id);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            res.render('new-book', { book, errors: error.errors, title: 'New Book' });
        } else {
            throw error;
        }
    }
}));

// Book Detail
router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', { book, title: 'Book Details' });
    } else {
        const err = new Error('Page Not Found');
        err.status = 404;
        next(err);
    }
}));

// Update Book
router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books');
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render('update-book', { book, errors: error.errors, title: 'Book Details' });
        } else {
            throw error;
        }
    }
}));

// Delete Book
router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        console.log(`Book with id ${req.params.id} not found.`);
        res.redirect('/books');
    }
}));

module.exports = router;