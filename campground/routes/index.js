const express = require('express')
const router = express.Router()
const campground = require('../models/campground')

router.get('/', async (req, res) => {
    const camps = await campground.find({})
    res.status(200).json(camps)
})

router.post('/new', async (req, res) => {
    const newCamp = new campground(req.body.campground)
    await newCamp.save()
    res.status(200).redirect(`/${newCamp.id}`)
})

router.put('/edit/:id', async (req, res) => {
    const editCamp = await campground.findByIdAndUpdate({_id:req.params.id}, {...req.body.campground})
    res.status(200).redirect(`/${editCamp._id}`)
})

router.get('/:id', async (req, res) => {
    const camp = await campground.findById({_id: req.params.id})
    res.status(200).json(camp)
})

router.delete('/:id', async (req, res) => {
    await campground.findByIdAndDelete({_id: req.params.id})
    res.status(200).redirect('/')
})

module.exports = router