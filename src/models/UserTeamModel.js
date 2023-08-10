const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const User = require('./UserModel');
const Team = require('./TeamModel');

// Add the association with the role attribute
const UserTeam = sequelize.define('UserTeam', {
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Team.belongsToMany(User, { through: UserTeam, as: 'members' });
User.belongsToMany(Team, { through: UserTeam, as: 'teams' });

module.exports = UserTeam