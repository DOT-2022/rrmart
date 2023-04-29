const { Model, DataTypes } = require('sequelize');
const sequelize = global.sequelize;
const helpers = require('../src/api/v1/helpers/helpers');

class OtpLog extends Model {

    //Relationships
    static associate = (models) => {
    }
}

OtpLog.init({
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
}, {
    sequelize,
    timestamps: false,
    tableName: 'otp_logs',
    modelName: 'OtpLog',
});

module.exports = OtpLog;