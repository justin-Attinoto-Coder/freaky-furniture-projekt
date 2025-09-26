const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const products = await Product.findAll({ offset, limit: pageSize });
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send();
  res.json(product);
};

exports.getProductBySlug = async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.json([]);
  const product = await Product.findOne({ where: { slug } });
  res.json(product ? [product] : []);
};

exports.createProduct = async (req, res) => {
  try {
    const { namn, description, price, image, slug } = req.body;
    if (!namn || !description || !price || !image || !slug) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const product = await Product.create({ namn, description, price, image, slug });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send();
  const { op, path, value } = req.body;
  if (op !== 'replace' || path === '/id') {
    return res.status(400).json({ error: 'Invalid operation.' });
  }
  const field = path.replace('/', '');
  product[field] = value;
  await product.save();
  res.status(204).json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send();
  await product.destroy();
  res.status(204).send();
};
