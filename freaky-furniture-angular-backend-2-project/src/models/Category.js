const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Product = require('./Product');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  namn: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  slug: { type: DataTypes.STRING, unique: true },
}, {
  timestamps: false,
});

Category.belongsToMany(Product, { through: 'CategoryProducts', foreignKey: 'categoryId' });
Product.belongsToMany(Category, { through: 'CategoryProducts', foreignKey: 'productId' });

module.exports = Category;
