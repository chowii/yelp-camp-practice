const router = require('express').Router()
const catchAsync = require('../../error/catchAsync')
const UserModel = require('../data/userModel')
const passport = require('passport')

router.post('/register', catchAsync(async (req, res) => {
    const {email, username, password} = req.body
    const user = new UserModel({email, username})
    const registeredUser = await UserModel.register(user, password)
    console.log(registeredUser)
    res.send(registeredUser)
}))

router.post(
    '/login',
    passport.authenticate('local', {}),
    (req, res) => {
        res.send(req.user);
    })

router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/campgrounds')
})

module.exports = router
