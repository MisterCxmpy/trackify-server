const User = require('../models/UserModel.js');

class UserService {

    static async create(userData) {
        try {
            const { password, username } = userData;
            const user = await User.create({
                password,
                username
            });

            return { ...user.dataValues, password }
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    static async query(username) {
        try {
            const users = await User.findAll({ where: username })

            return users;
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }
}

module.exports = UserService;