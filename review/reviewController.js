const CampgroundModel = require('../campground/data/campgroundModel')
const ReviewModel = require('./data/reviewModel')
const ApiError = require("../error/ApiError");

module.exports.createNewReview = async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id)
    const review = new ReviewModel(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const {id: campId, reviewId} = req.params
    const review = await ReviewModel.findByIdAndDelete(reviewId)
    const updatedCamp = await CampgroundModel.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}})
    if (!updatedCamp) {
        throw new ApiError("Campground Not Found", 404)
    }
    if (!review) {
        throw new ApiError("Review Not Found", 404)
    }
    review.delete()
    res.redirect(`/campgrounds/${campId}`)
}
