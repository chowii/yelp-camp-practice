const express = require('express')
const mongoose = require('mongoose')
// const campgroundRoute = require('./campground/routes') TODO reuse when routes are moved to express router
const ApiError = require('./error/ApiError')
const catchAsync = require('./error/catchAsync')
const {campgroundSchema} = require("./campground/data/campgroundSchema");
const CampgroundModel = require("./campground/data/campgroundModel");
const ReviewModel = require('./review/data/reviewModel')
const {reviewSchema} = require('./review/data/reviewSchema')
const PORT = 3000
const app = express()

mongoose.connect(
    'mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB Connection Error'))
db.once('open', () => {
    console.log('DB Connected')
})

app.use(express.json())

// app.use('/campgrounds', campgroundRoute) TODO reuse when routes are moved to express router

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(item => item.message).join(',')
        throw new ApiError(errMsg, 400)
    } else {
        next()
    }
}

app.get('/', catchAsync(async (req, res) => {
    const camps = await CampgroundModel.find({}).populate('reviews')
    res.status(200).json(camps)
}))

app.post('/new', validateCampground, catchAsync(async (req, res) => {
    const newCamp = new CampgroundModel(req.body.campground)
    await newCamp.save()
    res.status(200).redirect(`/${newCamp.id}`)
}))

app.put('/edit/:id', validateCampground, catchAsync(async (req, res) => {
    const editCamp = await CampgroundModel.findByIdAndUpdate({_id: req.params.id}, {...req.body.campground})
    res.status(200).redirect(`/${editCamp._id}`)
}))

app.get('/:id', catchAsync(async (req, res) => {
    const camp = await CampgroundModel.findById(req.params.id)
    res.status(200).json(camp)
}))

app.delete('/:id', catchAsync(async (req, res) => {
    await CampgroundModel.findByIdAndDelete({_id: req.params.id})
    res.status(200).redirect('/')
}))

const validateReview = (req, res, next) => {
    let value = req.body;
    console.log(value)
    const {error} = reviewSchema.validate(value)
    if (error) {
        const errMsg = error.details.map(item => item.message).join(',')
        throw new ApiError(errMsg, 400)
    } else {
        next()
    }
}

app.post('/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id)
    const review = new ReviewModel(req.body.review);
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    res.redirect(`/${campground._id}`)
}))

app.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id: campId, reviewId} = req.params
    ReviewModel.findByIdAndDelete(reviewId)
    await CampgroundModel.findByIdAndUpdate(campId, { $pull: { reviews: reviewId }})
    res.redirect(`/${campId}`)
}))

app.all('*', (req, res, next) => {
    next(new ApiError('Not Found', 404))
})

app.use((err, req, res, next) => {
    const {message = 'Something Went Wrong', statusCode = 500} = err
    res.status(statusCode).send(message)
})

app.listen(PORT, () => {
    console.log('LIVE from ', PORT)
})
