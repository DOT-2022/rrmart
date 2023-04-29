'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('orders', {
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
                allowNull: false,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id'
                },
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
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

    async down(queryInterface) {
        await queryInterface.dropTable('orders');
    }
};
