const Category = require('../models/Category');
const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.getCategories = async (req, res) => {
  const categories = await Category.findAll({ include: Product });
  res.json(categories);
};

exports.getCategoryById = async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: Product });
  if (!category) return res.status(404).send();
  res.json(category);
};

exports.getCategoryBySlug = async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.json([]);
  const category = await Category.findOne({ where: { slug }, include: Product });
  res.json(category ? [category] : []);
};

exports.createCategory = async (req, res) => {
  try {
    const { namn, image, slug } = req.body;
    if (!namn || !image || !slug) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const category = await Category.create({ namn, image, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).send();
  const { op, path, value } = req.body;
  if (op !== 'replace' || path === '/id') {
    return res.status(400).json({ error: 'Invalid operation.' });
  }
  const field = path.replace('/', '');
  category[field] = value;
  await category.save();
  res.status(204).json(category);
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).send();
  await category.destroy();
  res.status(204).send();
};

exports.addProductToCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.categoryID);
  const product = await Product.findByPk(req.params.productId);
  if (!category || !product) return res.status(404).send();
  await category.addProduct(product);
  res.status(204).send();
};

exports.removeProductFromCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.categoryID);
  const product = await Product.findByPk(req.params.productId);
  if (!category || !product) return res.status(404).send();
  await category.removeProduct(product);
  res.status(204).send();
};
