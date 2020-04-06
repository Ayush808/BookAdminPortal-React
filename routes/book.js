const express = require('express')
const router = express.Router()

//import  category controller
const { createBook, bookById, read, list, getPhoto } = require('../controllers/book')
//import middleware to ensure category only accessed by admin
const { requireSignIn } = require('../controllers/auth')

router.post('/book/create', requireSignIn, createBook)
router.get('/book/:bookId', read)
router.get('/books', list)
router.get('/book/photo/:bookId', getPhoto)

router.param("bookId", bookById)

module.exports = router