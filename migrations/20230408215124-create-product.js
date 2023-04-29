'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('products', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            image1: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            image2: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            image3: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            image4: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            actual_price: {
                type: DataTypes.FLOAT(10, 2),
                allowNull: true,
                defaultValue: 0.00
            },
            sale_price: {
                type: DataTypes.FLOAT(10, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 1
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
    async down(queryInterface) {
        await queryInterface.dropTable('products');
    }
};