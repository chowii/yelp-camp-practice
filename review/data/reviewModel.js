const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewModel = new Schema({
    text: String,
    rating: Number
})

module.exports = mongoose.model('Review', reviewModel)