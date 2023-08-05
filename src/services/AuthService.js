const User = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {

    static createToken(userPayload) {
        return jwt.sign(userPayload, process.env.JWT_SECRET)
    }

    static async authenticateUser(userData) {
        try {
            const { username, password } = userData;
            const user = await User.findOne({ where: { username } });

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
}

module.exports = AuthService;