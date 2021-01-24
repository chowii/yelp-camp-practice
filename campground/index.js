const router = require('express').Router()
const {campgroundSchema} = require('./data/campgroundSchema')
const catchAsync = require('../error/catchAsync')
const ApiError = require("../error/ApiError");
const {isCampgroundAuthor} = require("../user/isCampgroundAuthor");
const {isLoggedIn} = require('../user/isLoggedIn')
const campgroundController = require('./campgroundController')
const http = require("http");

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(item => item.message).join(',')
        throw new ApiError(errMsg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgroundList = await campgroundController.getAllCampgrounds()
    res.status(200).json(campgroundList)
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const newCampId = await campgroundController.createCampground({
        userId: req.user._id, campground: req.body
    })
    res.status(200).redirect(`/campgrounds/${newCampId}`)
}))

router.put('/edit/:id', isLoggedIn, isCampgroundAuthor, validateCampground, catchAsync(async (req, res) => {
    const campground = await campgroundController.editCampground(req.params, req.body.campground)
    res.status(200).redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await campgroundController.getCampground(req.params.id)
    if (camp) {
        res.status(200).json(camp)
    } else {
        res.status(404).send({
            message: `Campground with id: ${req.params.id} not found`
        })
    }
}))

router.delete('/:id', isLoggedIn, isCampgroundAuthor, catchAsync(async (req, res) => {
    await campgroundController.deleteCampground(req.params.id)
    res.status(200).send({action: 'success'})
}))

module.exports = router
