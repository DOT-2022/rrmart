'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

require('dotenv').config({path:__dirname+'/./../../.env'});

(async () => {

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            pool: {
                max: 100,
                min: 0,
                idle: 200000,
                acquire: 1000000,
            }
        }
    );
    
    global.sequelize = sequelize;
    const checkConn = sequelize.authenticate();

    try {
        await checkConn;
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.log(`Unable to connect to the database ${err.message}`);
    }
})();

const modelsDirectory = path.join(__dirname, '../../models');

// iterate over models directory and initialize each of them
const models = Object.assign({}, ...fs.readdirSync(modelsDirectory)
    .map(function (file) {
        console.log(file);
        const model = require('../../models/' + file);
        
        return {
            [model.name]: model
        };
    })
);

// create associations between models
for (const model of Object.keys(models)) {
    typeof models[model].associate === 'function' && models[model].associate(models);
}

models.sequelize = sequelize;
module.exports = models;