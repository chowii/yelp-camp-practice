const CampgroundModel = require('./data/campgroundModel')

module.exports.getAllCampgrounds = async (req, res) => {
    const camps = await CampgroundModel.find({})
    res.status(200).json(camps)
}

module.exports.getCampground = async (req, res) => {
    const camp = await CampgroundModel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.status(200).json(camp)
}

module.exports.createCampground = async (req, res) => {
    const newCamp = new CampgroundModel(req.body.campground)
    newCamp.author = req.user._id
    await newCamp.save()
    res.status(200).redirect(`/campgrounds/${newCamp.id}`)
}

module.exports.editCampground = async (req, res) => {
    const editCamp = await CampgroundModel.findByIdAndUpdate({_id: req.params.id}, {...req.body.campground})
    res.status(200).redirect(`/campgrounds/${editCamp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const campground = await CampgroundModel.findById({_id: req.params.id}).populate('author')
    campground.delete()
    res.status(200).send({action: 'success'})
}