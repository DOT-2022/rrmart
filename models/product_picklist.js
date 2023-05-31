const { Model, DataTypes } = require('sequelize');
const sequelize = global.sequelize;

class ProductPickList extends Model {

    //Relationships
    static associate = (models) => {
    }
}

ProductPickList.init({
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
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
}, {
    sequelize,
    timestamps: false,
    tableName: 'product_picklists',
    modelName: 'ProductPickList',
});

module.exports = ProductPickList;