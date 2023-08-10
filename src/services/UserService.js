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

            return { ...user.dataValues, password: null }
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    static async query(id) {
        try {
            const users = await User.findByPk(id, {
                include: {
                    model: Team,
                    as: 'teams',
                    attributes: { exclude: ['password', 'id', 'updatedAt'] } // Exclude the 'password' attribute
                }, attributes: { exclude: ['password', 'updatedAt'] }
            })

            return users;
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    static async queryFC(friendCode) {
        const users = await User.findOne({
            where: {
                friend_code: friendCode
            },
            include: {
                model: Team,
                as: 'teams',
                attributes: { exclude: ['password', 'id', 'updatedAt'] } // Exclude the 'password' attribute
            }, attributes: { exclude: ['password', 'updatedAt', 'id'] }
        })

        return users;
    }

    static async getUserTeams(userId) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error('User not found.');
            }

            const teamsRaw = await user.getTeams({ attributes: ['team_name', 'id'] }); // get all teams from user

            const teams = teamsRaw.map(async team => { // map over each team and get their memebers with their role
                const membersRaw = await (await Team.findByPk(team.id)).getMembers({ attributes: ['username'] })
                const members = membersRaw.map(m => ({ username: m.username, role: m?.role }))

                return { team_name: team.team_name, members }
            });

            return await Promise.all(teams);
        } catch (error) {
            throw new Error('Failed to fetch user teams.');
        }
    }

}

module.exports = UserService;