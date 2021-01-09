const express = require('express')
const router = express.Router()
const campground = require('../data/campgroundModel')
const campgroundSchema = require('../data/campgroundSchema')
const catchAsync = require('../../error/catchAsync')
const ApiError = require("../../error/ApiError");

// TODO reuse when routes are moved to express router
// const validateCampground = (req, res, next) => {
//     const {error} = campgroundSchema.validate(req.body)
//     if (error) {
//         const errMsg = error.details.map(item => item.message).join(',')
//         throw new ApiError(errMsg, 400)
//     } else {
//         next()
//     }
// }
//
// router.get('/', catchAsync(async (req, res) => {
//     const camps = await campground.find({})
//     res.status(200).json(camps)
// }))
//
// router.post('/new', validateCampground, catchAsync(async (req, res) => {
//     const newCamp = new campground(req.body.campground)
//     await newCamp.save()
//     res.status(200).redirect(`/${newCamp.id}`)
// }))
//
// router.put('/edit/:id', validateCampground, catchAsync(async (req, res) => {
//     const editCamp = await campground.findByIdAndUpdate({_id: req.params.id}, {...req.body.campground})
//     res.status(200).redirect(`/${editCamp._id}`)
// }))
//
// router.get('/:id', catchAsync(async (req, res) => {
//     const camp = await campground.findById(req.params.id)
//     res.status(200).json(camp)
// }))
//
// router.delete('/:id', catchAsync(async (req, res) => {
//     await campground.findByIdAndDelete({_id: req.params.id})
//     res.status(200).redirect('/')
// }))

module.exports = router
