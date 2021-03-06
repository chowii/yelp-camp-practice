const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ReviewModel = require('../../review/data/reviewModel')

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await ReviewModel.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)
