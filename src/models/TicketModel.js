const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
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
Ticket.belongsTo(Member, { foreignKey: 'owner_id', as: 'owner' });

module.exports = Ticket;
