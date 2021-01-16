const router = require('express').Router()
const catchAsync = require('../../error/catchAsync')
const UserModel = require('../data/userModel')

router.post('/register', catchAsync(async (req, res) => {
    const {email, username, password} = req.body
    const user = new UserModel({email, username})
    const registeredUser = await UserModel.register(user, password)
    console.log(registeredUser)
    res.send(registeredUser)
}))

module.exports = router
