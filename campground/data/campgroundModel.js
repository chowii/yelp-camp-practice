const mongoose = require('mongoose')
const Schema = mongoose.Schema

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String,
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review4'
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)