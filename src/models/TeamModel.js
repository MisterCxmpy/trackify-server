const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance
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
    },
});

module.exports = Team;
