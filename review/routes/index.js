const express = require('express')
const router = express.Router({ mergeParams: true})
const ReviewModel = require('../data/reviewModel')
const {reviewSchema} = require('../data/reviewSchema')
const CampgroundModel = require('../../campground/data/campgroundModel')
const catchAsync = require('../../error/catchAsync')
const ApiError = require("../../error/ApiError");
const {isLoggedIn} = require('../../user/isLoggedIn')

const validateReview = (req, res, next) => {
    console.log(`body:`)
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(item => item.message).join(',')
        console.log('error')
        throw new ApiError(errMsg, 400)
    } else {
        console.log('next')
        next()
    }
}

router.post('/', validateReview, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id)
    const review = new ReviewModel(req.body.review);
    console.log(req.params.id)
    console.log('test')
    console.log(campground)
    campground.reviews.push(review);
    await review.save()
    console.log('test2')
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const {id: campId, reviewId} = req.params
    ReviewModel.findByIdAndDelete(reviewId)
    await CampgroundModel.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}})
    res.redirect(`/campgrounds/${campId}`)
}))

module.exports = router;
