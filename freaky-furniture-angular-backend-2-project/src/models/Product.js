const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  namn: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING },
  slug: { type: DataTypes.STRING, unique: true },
}, {
  timestamps: false,
});

module.exports = Product;
