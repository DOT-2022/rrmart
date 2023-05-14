'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable('user_addresses', { 
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: {
                    tableName: 'users'
                },
                key: 'id'
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        landmark: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        city: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        state: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        country: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        pincode: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('user_addresses');
  }
};
