const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance

const nanoid = require('nanoid');
const Team = require('./TeamModel');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => nanoid(6)
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
    },
    team_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Ticket;
