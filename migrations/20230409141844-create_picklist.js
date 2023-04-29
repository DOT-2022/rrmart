'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('picklists', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            order_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            order_type: {
                type: DataTypes.STRING,
                defaultValue: 'Instant',
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'Order Placed',
                allowNull: false,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: '1'
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

    async down(queryInterface) {
        await queryInterface.dropTable('picklists');
    }
};
