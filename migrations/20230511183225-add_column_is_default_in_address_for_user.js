'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_addresses', 'is_default', { 
        type: Sequelize.BOOLEAN,
        after: 'is_active',
        allowNull: false,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('is_default');
  }
};
