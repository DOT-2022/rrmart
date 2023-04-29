'use strict';
const {
    Model, DataTypes
} = require('sequelize');
const sequelize = global.sequelize;

class TopProduct extends Model {
    static associate(models) {
        TopProduct.belongsTo(models.Product, {
            foreignKey: 'product_id',
        });
    }
}
TopProduct.init({
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
    tableName: 'top_products',
    modelName: 'TopProduct',
});

module.exports = TopProduct;