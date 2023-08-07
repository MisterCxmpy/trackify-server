const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Team = require('./TeamModel');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

User.belongsToMany(Team, { through: 'UserTeam' });
Team.belongsToMany(User, { through: 'UserTeam' });

module.exports = User;
