const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
  // List products with pagination
  async list(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const products = await Product.findAll({ offset, limit: pageSize });
    res.status(200).json(products);
  },

  // Get product by ID
  async getById(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send();
    res.status(200).json(product);
  },

  // Get product by slug
  async getBySlug(req, res) {
    const { slug } = req.query;
    const products = await Product.findAll({ where: { slug } });
    res.status(200).json(products);
  },

  // Create product
  async create(req, res) {
    try {
      const { namn, description, price, image, slug } = req.body;
      if (!namn || !price) return res.status(400).json({ errors: { namn: 'Required', price: 'Required' } });
      const product = await Product.create({ namn, description, price, image, slug });
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ errors: err.errors });
    }
  },

  // Update product
  async update(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).send();
      const { op, path, value } = req.body;
      if (op === 'replace' && path !== '/id') {
        const field = path.replace('/', '');
        product[field] = value;
        await product.save();
        return res.status(204).json(product);
      }
      res.status(400).json({ errors: 'Invalid operation' });
    } catch (err) {
      res.status(400).json({ errors: err.errors });
    }
  },

  // Delete product
  async remove(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send();
    await product.destroy();
    res.status(204).send();
  },
};
