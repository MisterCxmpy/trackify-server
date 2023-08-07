const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Team = require('./TeamModel'); // Import the Team model
const User = require('./UserModel'); // Import the Team model

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
        defaultValue: 'new' // new, todo, closed, removed
    }
});

// Define associations
Ticket.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });
Ticket.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

module.exports = Ticket;
