'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('product_picklists', {
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
            picklist_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'picklists'
                    },
                    key: 'id'
                }
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
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
       await queryInterface.dropTable('product_picklists');
    }
};
