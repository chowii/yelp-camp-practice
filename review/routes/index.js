const express = require('express')
const router = express.Router({ mergeParams: true})
const ReviewModel = require('../data/reviewModel')
const {reviewSchema} = require('../data/reviewSchema')
const CampgroundModel = require('../../campground/data/campgroundModel')
const catchAsync = require('../../error/catchAsync')
const ApiError = require("../../error/ApiError");
const {isReviewAuthor} = require("../../user/isReviewAuthor");
const {isLoggedIn} = require('../../user/isLoggedIn')

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(item => item.message).join(',')
        throw new ApiError(errMsg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id)
    const review = new ReviewModel(req.body.review);
   review.author = req.user._id
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id: campId, reviewId} = req.params
    const review = await ReviewModel.findByIdAndDelete(reviewId)
    const updatedCamp = await CampgroundModel.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}})
    if (!updatedCamp) {
        throw new ApiError("Campground Not Found", 404)
    }
    if (!review) {
        throw new ApiError("Review Not Found", 404)
    }
    res.redirect(`/campgrounds/${campId}`)
    review.delete()
}))

module.exports = router;
