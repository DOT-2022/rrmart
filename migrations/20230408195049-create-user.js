'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('users', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mobile: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            device_id: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            api_token: {
                type: DataTypes.TEXT,
                allowNull: true,
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
    async down(queryInterface) {
        await queryInterface.dropTable('users');
    }
};