const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING);

// Synchronize the models with the database
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing the database:', error);
    }); // Set force to true to drop and re-create tables on each sync

module.exports = sequelize;
