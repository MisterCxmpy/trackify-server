const User = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Team = require('../models/TeamModel.js');

class AuthService {

    static createToken(userPayload) {
        return jwt.sign(userPayload, process.env.JWT_SECRET)
    }

    static createTeamToken(teamPermissions) {
        return jwt.sign({ permissions: teamPermissions }, process.env.JWT_SECRET)
    }

    static async authenticateUser(userData) {
        try {
            const { email, password } = userData;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error('Authentication failed. (User not found.)');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new Error('Authentication failed. (Incorrect Password.)');
            }

            return { ...user.dataValues, password: null };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async hashPass(password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return hashedPassword;
        } catch (error) {
            throw new Error('Hashing password failed.');
        }
    }

    static async calculateTeamPermissions(userId, teamId) {
        try {
            const team = await Team.findByPk(teamId, { attributes: { include: { model: User, as: 'members' } } });
            console.log(team.members.find(m => m.id === userId));
            return ['read', 'write', 'delete']
        } catch (error) {
            console.log(error);
            return ['read', 'write', 'delete']
        }


    }
}

module.exports = AuthService;