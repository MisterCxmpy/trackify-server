// teamAuthMiddleware.js
const jwt = require('jsonwebtoken');

const requireTeamPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        const teamToken = req.cookies.teamToken;

        if (!teamToken) {
            return res.status(401).json({ error: 'Team token not provided' });
        }

        try {
            const decodedToken = jwt.verify(teamToken, process.env.JWT_SECRET);
            const permissions = decodedToken.permissions;

            // Check if the user has at least one of the required permissions
            const hasRequiredPermission = requiredPermissions.some(permission =>
                permissions.includes(permission)
            );

            if (!hasRequiredPermission) {
                return res.status(403).json({ error: `Insufficient permissions: ${requiredPermissions}` });
            }

            next(); // User has required permissions, proceed to the next middleware
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = requireTeamPermissions;
