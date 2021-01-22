const UserModel = require('./data/userModel')

module.exports.createNewUser = async (req, res) => {
    const {email, username, password} = req.body
    const user = new UserModel({email, username})
    const registeredUser = await UserModel.register(user, password)
    res.send(registeredUser)
}

module.exports.logout = (req, res) => {
    req.logout()
    res.redirect('/campgrounds')
}
