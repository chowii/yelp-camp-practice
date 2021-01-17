module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    return res.status(401).send({
        error: {
            message: 'Unauthenticated',
            code: 401
        }
    })
}
