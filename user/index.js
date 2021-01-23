const router = require('express').Router()
const catchAsync = require('../error/catchAsync')
const passport = require('passport')
const userController = require("./userController")

router.post('/register', catchAsync((req, res) => {
    const user = userController.createNewUser(req.body)
    res.send(user)
}))

router.post(
    '/login',
    passport.authenticate('local', {}),
    (req, res) => res.send(req.user))

router.post('/logout', ((req, res) => {
    userController.logout(req.user, req.logout)
    res.redirect('/campgrounds')
}))

module.exports = router
