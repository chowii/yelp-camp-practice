const ReviewModel = require('../review/data/reviewModel')
const ApiError = require("../error/ApiError");

module.exports.isReviewAuthor = async (req, res, next) => {
    const {reviewId} = req.params
    const review = await ReviewModel.findById(reviewId)
    if (review.author.equals(req.user._id)) {
        next()
    } else {
        next(new ApiError("unauthorized", 401))
    }
}
