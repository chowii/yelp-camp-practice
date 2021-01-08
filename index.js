const express = require('express')
const mongoose = require('mongoose')
const campgroundRoute = require('./campground/routes')
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

app.listen(PORT, () => {
    console.log('LIVE from ', PORT)
})