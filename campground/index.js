const router = require('express').Router()
const {campgroundSchema} = require('./data/campgroundSchema')
const catchAsync = require('../error/catchAsync')
const ApiError = require("../error/ApiError");
const {isCampgroundAuthor} = require("../user/isCampgroundAuthor");
const {isLoggedIn} = require('../user/isLoggedIn')
const campgroundController = require('./campgroundController')

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const errMsg = error.details.map(item => item.message).join(',')
        throw new ApiError(errMsg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(campgroundController.getAllCampgrounds))

router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground))

router.put('/edit/:id', isLoggedIn, isCampgroundAuthor, validateCampground, catchAsync(campgroundController.editCampground))

router.get('/:id', catchAsync(campgroundController.getCampground))

router.delete('/:id', isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.deleteCampground))

module.exports = router
