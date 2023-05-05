'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('product_picklists', 'quantity', {
            type: Sequelize.INTEGER,
            after: 'picklist_id',
            allowNull: false,
            defaultValue: 0
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('quantity');
    }
};
