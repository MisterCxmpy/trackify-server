const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Team = require('./TeamModel');

const nanoid = require('nanoid')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    friend_code: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: () => nanoid(6)
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.beforeCreate(async (user) => {
    const generatedUsername = `${user.first_name.toLowerCase()} ${user.last_name.toLowerCase()}`;
    user.username = generatedUsername;
});

User.belongsToMany(User, {
    as: 'friends',
    through: 'UserFriends',
    foreignKey: 'userId',
    otherKey: 'friendId'
});

User.belongsToMany(Team, { through: 'UserTeam' });
Team.belongsToMany(User, { through: 'UserTeam' });

module.exports = User;
