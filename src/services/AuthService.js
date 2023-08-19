const User = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Team = require('../models/TeamModel.js');

const UserPermissions = {
    administrator: ['read', 'write', 'delete', 'set-permissions', 'manage-users'],
    contributer: ['read', 'write', 'delete'],
    stakeholder: ['read'],
    reader: ['read-limited'],
}

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
        const exclude = ['password', 'updatedAt', 'createdAt', 'first_name', 'last_name'];
        try {
            const team = await Team.findByPk(teamId, {
                include: [{
                    model: User,
                    as: 'members',
                    attributes: { exclude },
                    through: { attributes: ['role'] }
                }],
            });

            const member = team.dataValues.members.find(m => m.id === userId);
            if (!member) throw new Error('Team member not found.')

            const memberWRole = { ...member.dataValues, role: member?.UserTeam?.role }

            const perms = UserPermissions[memberWRole.role];
            return { role: memberWRole.role, perms, team_name: team.team_name }
        } catch (error) {
            console.log(error);
            return null
        }
    }
}

module.exports = AuthService;