/*File name: comp229-s2023-midterm-301297110
Student Name: Alessandra Primatesta
Student ID: 301.297.110
Due date: June 25, 2023*/

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book 
router.get('/details', async (req, res, next) => {

  try {
    res.render('books/details', {title: 'Add Book', book: {} })
  } 
  catch (err) {
    console.log(err);
  }
});

// POST process the Book Details page and create a new Book 
router.post('/details', async (req, res, next) => {

     let newBook = new book ({
      "Title": req.body.Title,
      "Description": req.body.Description,
      "Price": req.body.Price,
      "Author": req.body.Author,
      "Genre": req.body.Genre
     });

     try {
          await newBook.save();
          res.redirect('/books')
        }
     catch (err) {
          console.log(err);
          res.status(500).send(err);
     }
});

// GET the Book Details page in order to edit an existing Book
router.get('/details/:id', async (req, res, next) => {

    let id = req.params.id;

    try {
      let bookToEdit = await book.findById(id);
      res.render('books/details', {title: 'Edit Book', book: bookToEdit});
    }
    catch (err) {
          console.log(err);
          res.status(500).send(err);
    }
});

// POST - process the information passed from the details form and update the document
router.post('/details/:id', async (req, res, next) => {

  let id = req.params.id;

  let updatedBook = {
    "Title": req.body.Title,
    "Description": req.body.Description,
    "Price": req.body.Price,
    "Author": req.body.Author,
    "Genre": req.body.Genre
   }

   try {
    await book.updateOne({_id: id}, updatedBook);
    res.redirect('/books');
  }
  catch (err) {
        console.log(err);
        res.status(500).send(err);
  }

});

// GET - process the delete by user id
router.get('/delete/:id', async (req, res, next) => {

    let id = req.params.id;

    try {
      await book.findByIdAndRemove(id);
      res.redirect('/books');
    }
    catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
});


module.exports = router;
