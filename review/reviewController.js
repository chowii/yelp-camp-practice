const CampgroundModel = require('../campground/data/campgroundModel')
const ReviewModel = require('./data/reviewModel')
const ApiError = require("../error/ApiError");

module.exports.createNewReview = async ({campId, userId, reviewData = {}}) => {
    const campground = await CampgroundModel.findById(campId)
    const review = new ReviewModel(reviewData);
    review.author = userId
    campground.reviews.push(review);
    await review.save()
    await campground.save()
    return campground._id
}

module.exports.deleteReview = async ({campId, reviewId}) => {
    const review = await ReviewModel.findById(reviewId)
    const campground = await CampgroundModel.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}})
    if (!campground) {
        throw new ApiError("Campground Not Found", 404)
    }
    if (!review) {
        throw new ApiError("Review Not Found", 404)
    }
    review.delete()
    return campground.id
}
