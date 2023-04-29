'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            is_active: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 1
            },
            created_at: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.BIGINT,
                allowNull: true,
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('categories');
    }
};