const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const campgroundRoute = require('./campground')
const reviewRoute = require('./review')
const ApiError = require('./error/ApiError')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const userRoute = require('./user/routes/index')
const UserModel = require('./user/data/userModel')

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

const sessionConfig = {
    secret: 'UseDifferentSecretForProd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(UserModel.authenticate()))
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

app.use('/', userRoute)
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewRoute)

app.all('*', (req, res, next) => {
    next(new ApiError('Not Found', 404))
})

app.use((err, req, res, next) => {
    const {message = 'Something Went Wrong', statusCode = 500} = err
    res.status(statusCode).send({
        error: {
            message: message,
            code: statusCode
        }
    })
})

app.listen(PORT, () => {
    console.log('LIVE from ', PORT)
})
