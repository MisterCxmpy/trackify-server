const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Import your Sequelize instance
const Team = require('./TeamModel');

const nanoid = require('nanoid');

const VALID_STATES = ['new', 'in progress', 'completed', 'blocked'];

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
        allowNull: false,
        defaultValue: 'new', // Set default value to 'new'
        validate: {
            isIn: {
                args: [VALID_STATES],
                msg: 'Invalid ticket state'
            }
        }
    },
    team_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Ticket;
