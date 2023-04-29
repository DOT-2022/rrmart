const { Model, DataTypes } = require('sequelize');
const sequelize = global.sequelize;
const helpers = require('../src/api/v1/helpers/helpers');

class User extends Model {

    //Relationships
    // static associate = (models) => {
    //     User.hasMany(models.Orders);
    // }
}

User.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
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
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('role', helpers.titleCase(value));
        }
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUnique: function (value, next) {
                var self = this;
                User.findOne({ where: { mobile: value } })
                    .then(function (user) {
                        // reject if a different user wants to use the same mobile number
                        if (user && self.id !== user.id) {
                            return next('Mobile already in use!');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            }
        }
    },
    api_token: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    device_id: {
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
}, {
    sequelize,
    timestamps: false,
    tableName: 'users',
    modelName: 'User',
});

module.exports = User;