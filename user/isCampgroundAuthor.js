const CampgroundModel = require('../campground/data/campgroundModel')
const ApiError = require("../error/ApiError");

module.exports.isCampgroundAuthor = async (req, res, next) => {
    const campground = await CampgroundModel.findById(req.params.id).populate('author')
    if (req.user.id === campground.author.id) {
        next()
    } else {
        next(new ApiError("unauthorized", 401))
    }
}
