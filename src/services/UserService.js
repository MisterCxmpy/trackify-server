const Team = require('../models/TeamModel.js');
const User = require('../models/UserModel.js');

class UserService {

    static async create(userData) {
        try {
            const { password, first_name, last_name, email } = userData;
            const user = await User.create({
                password,
                first_name,
                last_name,
                email
            });

            return { ...user.dataValues, password }
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    static async query(id) {
        try {
            const users = await User.findByPk(id, {
                include: {
                    model: User,
                    as: 'friends',
                    attributes: { exclude: ['password', 'id', 'updatedAt'] } // Exclude the 'password' attribute
                }, attributes: { exclude: ['password', 'updatedAt'] }
            })

            return users;
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    static async addFriend(friendCode, userId) {
        try {
            const user1 = await User.findByPk(userId)
            const user2 = await User.findOne({ where: { friend_code: friendCode } })

            await user1.addFriend(user2)
            const friends = await user1.getFriends()

            return friends
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    }

    static async getUserFriends(userId) {
        try {
            const user = await User.findByPk(userId)
            const friends = await user.getFriends()

            return friends
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
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