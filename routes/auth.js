const express = require('express')
const router = express.Router()

//import user controller
const { signUp, signIn, signOut } = require('../controllers/auth')

//import validator
const { userSignupValidator } = require('../controllers/user')

router.post('/register', userSignupValidator, signUp)
router.post('/login', signIn)
router.get('/signout', signOut)



module.exports = router