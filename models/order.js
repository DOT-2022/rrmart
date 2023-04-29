const { Model, DataTypes } = require('sequelize');
const sequelize = global.sequelize;
const helpers = require('../src/api/v1/helpers/helpers');

class Order extends Model {

    //Relationships
    static associate = (models) => {
        Order.hasOne(models.PickList, {
            foreignKey: 'order_id',
        });

        Order.belongsTo(models.User, {
            foreignKey: 'user_id'
        });
    }
}

Order.init({
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
        defaultValue: 'Order Placed'
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
}, {
    sequelize,
    timestamps: false,
    tableName: 'orders',
    modelName: 'Order',
});

module.exports = Order;