const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance
const Ticket = require('./TicketModel');

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
    }
});

Team.hasMany(Ticket, { foreignKey: 'team_id', as: 'backlog' });

module.exports = Team