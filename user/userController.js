const UserModel = require('./data/userModel')

module.exports.createNewUser = async ({email, username, password}) => {
    const user = new UserModel({email, username})
    return await UserModel.register(user, password)
}

module.exports.logout = (user, logout) => {
    if (user) logout()
}
