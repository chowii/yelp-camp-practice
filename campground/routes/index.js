const express = require('express')
const router = express.Router()
const CampgroundModel = require('../data/campgroundModel')
const {campgroundSchema} = require('../data/campgroundSchema')
const catchAsync = require('../../error/catchAsync')
const ApiError = require("../../error/ApiError");
const {isCampgroundAuthor} = require("../../user/isCampgroundAuthor");
const {isLoggedIn} = require('../../user/isLoggedIn')

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
    const camps = await CampgroundModel.find({})
    res.status(200).json(camps)
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const newCamp = new CampgroundModel(req.body.campground)
    newCamp.author = req.user._id
    await newCamp.save()
    res.status(200).redirect(`/campgrounds/${newCamp.id}`)
}))

router.put('/edit/:id', isLoggedIn, isCampgroundAuthor, validateCampground, catchAsync(async (req, res) => {
    const editCamp = await CampgroundModel.findByIdAndUpdate({_id: req.params.id}, {...req.body.campground})
    res.status(200).redirect(`/${editCamp._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await CampgroundModel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.status(200).json(camp)
}))

router.delete('/:id', isLoggedIn, isCampgroundAuthor, catchAsync(async (req, res) => {
    const campground = await CampgroundModel.findById({_id: req.params.id}).populate('author')
    campground.delete()
    res.status(200).send({action: 'success'})
}))

module.exports = router
