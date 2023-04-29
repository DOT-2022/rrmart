const { Model, DataTypes } = require('sequelize');
const sequelize = global.sequelize;

class PickList extends Model {

    //Relationships
    static associate = (models) => {
        PickList.belongsTo(models.Order, {
            foreignKey: 'order_id',
        });

        PickList.belongsToMany(models.Product, {
            through: 'ProductPickList',
        });
    }
}

PickList.init({
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
}, {
    sequelize,
    timestamps: false,
    tableName: 'picklists',
    modelName: 'PickList',
});

module.exports = PickList;