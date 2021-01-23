const router = require('express').Router()
const catchAsync = require('../error/catchAsync')
const passport = require('passport')
const userController = require("./userController")

router.post('/register', catchAsync(async (req, res) => {
    try {
        const user = await userController.createNewUser(req.body)
        res.send(user)
    } catch (e) {
        res.status(406).send(e)
    }
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
