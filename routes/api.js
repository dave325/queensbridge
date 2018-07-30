var express = require('express');
var router = express.Router();
var bookController = require('../controllers/bookController.js');

/* POST create a new book */
router.post('/createBook', bookController.addBook);

/* POST retrieve all books */
router.post('/retrieveBooks', bookController.retrieveBooks);

/* POST delete a book */
router.post('/deleteBook', bookController.deleteBook);

/* POST update a book */
router.post('/updateBook', bookController.updateBook);

module.exports = router;
