const router = require('express').Router({mergeParams: true})
const {reviewSchema} = require('./data/reviewSchema')
const catchAsync = require('../error/catchAsync')
const ApiError = require("../error/ApiError");
const {isReviewAuthor} = require("../user/isReviewAuthor");
const {isLoggedIn} = require('../user/isLoggedIn')
const reviewController = require('./reviewController')

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
    const campgroundId = await reviewController.createNewReview({
        campId: req.params.id,
        review: req.body.review,
        userId: req.user._id
    })
    res.redirect(`/campgrounds/${campgroundId}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const campId = await reviewController.deleteReview({
        compId: req.params.id,
        reviewId: req.params.reviewId
    })
    res.redirect(`/campgrounds/${campId}`)
}))

module.exports = router;
