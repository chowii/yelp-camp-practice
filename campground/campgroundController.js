const CampgroundModel = require('./data/campgroundModel')

module.exports.getAllCampgrounds = async () => await CampgroundModel.find({})

module.exports.getCampground = async (id) => await CampgroundModel.findById(id).populate({
    path: 'reviews',
    populate: {
        path: 'author'
    }
}).populate('author');

module.exports.createCampground = async ({userId, campground}) => {
    const newCamp = new CampgroundModel(campground)
    newCamp.author = userId
    await newCamp.save()
    return newCamp.id
}

module.exports.editCampground = async (id, campground) => await CampgroundModel.findByIdAndUpdate({
    _id: id
}, {...campground})

module.exports.deleteCampground = async (id) => {
    const campground = await CampgroundModel.findById({_id: id}).populate('author')
    campground.delete()
    res.status(200).send({action: 'success'})
}