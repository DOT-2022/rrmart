'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('top_products', { 
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: {
                    tableName: 'products'
                },
                key: 'id'
            }
        },
        created_at: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.BIGINT,
            allowNull: true,
        }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('top_products');
  }
};
