const { Model, DataTypes } = require('sequelize');
const sequelize = global.sequelize;
const helpers = require('../src/api/v1/helpers/helpers');

class Category extends Model {

    //Relationships
    static associate = (models) => {
        Category.hasMany(models.Product, {
            foreignKey: 'category_id'
        });
    }
}

Category.init({
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
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'categories',
    modelName: 'Category',
});

module.exports = Category;