const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService')

const validateToken = async (req, res, next) => {
    // Get the token from the cookie
    const token = req?.cookies?.token;

    // Check if the token is missing
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Missing token.' });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded token to the request object for later use
        req.user = await UserService.query(decoded);

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle token verification error
        console.error(error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = validateToken;