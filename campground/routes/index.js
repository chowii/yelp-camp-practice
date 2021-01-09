const express = require('express')
const router = express.Router()
const campground = require('../models/campground')
const catchAsync = require('../../error/catchAsync')

router.get('/', catchAsync(async (req, res) => {
    const camps = await campground.find({})
    res.status(200).json(camps)
}))

router.post('/new', catchAsync(async (req, res) => {
    const newCamp = new campground(req.body.campground)
    await newCamp.save()
    res.status(200).redirect(`/${newCamp.id}`)
}))

router.put('/edit/:id', catchAsync(async (req, res) => {
    const editCamp = await campground.findByIdAndUpdate({_id: req.params.id}, {...req.body.campground})
    res.status(200).redirect(`/${editCamp._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await campground.findById(req.params.id)
    res.status(200).json(camp)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    await campground.findByIdAndDelete({_id: req.params.id})
    res.status(200).redirect('/')
}))

module.exports = router
