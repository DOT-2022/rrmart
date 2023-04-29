'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('otp_logs', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            mobile_no: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: false,
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
        await queryInterface.dropTable('otp_logs');
    }
};
