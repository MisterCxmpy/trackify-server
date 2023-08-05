const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance
const User = require('./UserModel');

const { v4: uuidv4 } = require('uuid');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4()
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
Team.hasMany(User, { foreignKey: 'team_id', as: 'members' });

module.exports = Team;
