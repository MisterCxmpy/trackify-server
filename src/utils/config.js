require('dotenv').config(); // Load environment variables from .env file

module.exports = {
    // Database configuration
    database: {
        connectionString: process.env.DB_CONNECTION_STRING || 'default-database-string',
    },

    // Cookie configuration
    cookies: {
        secure: process.env.COOKIE_SECURE === 'true' || false,
        maxAge: process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 2, // 7 days in milliseconds
        sameSite: 'Lax'
    },

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET
    },

    // Server configuration
    server: {
        port: process.env.PORT || 3000,
    },

    // Logging configuration
    logging: {
        level: process.env.LOGGING_LEVEL || 'info',
    },

    // Third-party API configuration
    thirdPartyAPI: {},
};
