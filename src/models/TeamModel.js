const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance
const User = require('./UserModel');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    team_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    backlog: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming backlog contains ticket IDs
        defaultValue: [] // Initialize with an empty array
    }
});

// Define associations
Team.hasMany(User, { foreignKey: 'team_id' });

module.exports = Team;
