const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    team_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define associations
Team.hasMany(Member, { foreignKey: 'team_id' });

module.exports = Team;
