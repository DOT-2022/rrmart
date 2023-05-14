const { Model, DataTypes } = require('sequelize');
const sequelize = global.sequelize;
const helpers = require('../src/api/v1/helpers/helpers');

class UserAddress extends Model {

    //Relationships
    // static associate = (models) => {
    //     User.hasMany(models.Orders);
    // }
}

UserAddress.init({
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
        allowNull: false,
        set(value) {
            this.setDataValue('first_name', helpers.titleCase(value));
        }
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('last_name', helpers.titleCase(value));
        }
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
    is_default: {
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
}, {
    sequelize,
    timestamps: false,
    tableName: 'user_addresses',
    modelName: 'UserAddress',
});

module.exports = UserAddress;
