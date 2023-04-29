'use strict';
const {
    Model, DataTypes
} = require('sequelize');
const sequelize = global.sequelize;

class Product extends Model {
    static associate(models) {
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
        });

        Product.belongsToMany(models.PickList, {
            through: 'ProductPickList',
        });
    }
}
Product.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('name', helpers.titleCase(value));
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('slug', helpers.slug(value));
        }
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
        allowNull: true,
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
}, {
    sequelize,
    timestamps: false,
    tableName: 'products',
    modelName: 'Product',
});

module.exports = Product;