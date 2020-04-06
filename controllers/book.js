//A node.js module for parsing form data, especially file uploads. Current status.
const formidable = require('formidable')
// core module
const fs = require('fs')
const Book = require('../models/Book')
const { errorHandler } = require("../ErrorHandler")

//get book by bookId
exports.bookById = (req, res, next, id) => {
    Book.findById(id).exec((err, book) => {
        if (err || !book) {
            return res.status(400).json({
                error: "Book not found!"
            })
        }
        req.book = book
        next()
    })
}

//read the book from the req
exports.read = (req, res) => {
    //photo is made undefined bcz we dont want it be shown in the response bcz photo has large size
    req.book.photo = undefined
    return res.json(req.book)
}

// create book of a particular category
exports.createBook = (req, res) => {
    // all the form data will be available from the new formidable IncomingForm 
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        // check for all fields
        const { name, description, author } = fields
        if (!name || !description || !author) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }

        let book = new Book(fields)
        // 'photo' is the name of the image field in the book schema
        if (files.photo) {
            // if the file size greater than 1 mb
            // 1kb = 1000 
            // 1mb =1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "image should be less than 1mb"
                })
            }

            book.photo.data = fs.readFileSync(files.photo.path)
            book.photo.contentType = files.photo.type
        }

        book.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}


/**
 * sell / arrival
 * by sell = /books?sortBy=sold&order=desc&limit=4
 * by arrival = /books?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all books are returned
 */

exports.list = (req, res) => {

    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Book.find()
        .select('-photo')
        .limit(limit)
        .exec((err, books) => {
            if (err) {
                return res.status(400).json({
                    error: 'books not found'
                });
            }
            res.json(books)
        })
}

exports.getPhoto = (req, res, next) => {
    if (req.book.photo.data) {
        res.set('Content-Type', req.book.photo.contentType)
        return res.send(req.book.photo.data)
    }
    next()
}