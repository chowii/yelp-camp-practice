const router = require('express').Router()
const catchAsync = require('../error/catchAsync')
const passport = require('passport')
const userController = require("./userController")

router.post('/register', catchAsync(userController.createNewUser))

router.post(
    '/login',
    passport.authenticate('local', {}),
    (req, res) => res.send(req.user))

router.post('/logout', userController.logout)

module.exports = router
