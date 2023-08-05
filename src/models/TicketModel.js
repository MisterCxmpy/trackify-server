const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const User = require('./UserModel')

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
});

// Define associations
Ticket.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

module.exports = Ticket;
