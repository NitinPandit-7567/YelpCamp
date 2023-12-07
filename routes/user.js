const express = require('express')
const router = express.Router({ mergeParams: true })
const User = require('../models/user');
const wrapAsync = require('../utils/catchAsync')
const passport = require('passport')
const redirectToOriginal = require('./middleware/redirectToOriginal')
const users = require('../controllers/users')
router.route('/register')
    .get(users.registerForm)
    .post(wrapAsync(users.register))

router.route('/login')
    .get(users.loginForm)
    .post(redirectToOriginal, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)


module.exports = router;