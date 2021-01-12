const express = require('express')
const mongoose = require('mongoose')
const campgroundRoute = require('./campground/routes')
const reviewRoute = require('./review/routes')
const ApiError = require('./error/ApiError')
const PORT = 3000
const app = express()

mongoose.connect(
    'mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB Connection Error'))
db.once('open', () => {
    console.log('DB Connected')
})

app.use(express.json())

app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewRoute)

app.all('*', (req, res, next) => {
    next(new ApiError('Not Found', 404))
})

app.use((err, req, res, next) => {
    const {message = 'Something Went Wrong', statusCode = 500} = err
    res.status(statusCode).send(message)
})

app.listen(PORT, () => {
    console.log('LIVE from ', PORT)
})
