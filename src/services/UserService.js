const Team = require('../models/TeamModel.js');
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

    static async query(id) {
        try {
            const users = await User.findByPk(id)

            return users;
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    static async getUserTeams(userId) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found.');
            }

            const teams = await user.getTeams({
                attributes: ['team_name'] // Only select the 'team_name' attribute
            });

            return teams;
        } catch (error) {
            throw new Error('Failed to fetch user teams.');
        }
    }

}

module.exports = UserService;