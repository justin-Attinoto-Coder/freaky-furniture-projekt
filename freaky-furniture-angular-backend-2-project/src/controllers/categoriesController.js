const Category = require('../models/Category');
const Product = require('../models/Product');

module.exports = {
  // List categories
  async list(req, res) {
    const categories = await Category.findAll({ include: Product });
    res.status(200).json(categories);
  },

  // Get category by ID
  async getById(req, res) {
    const category = await Category.findByPk(req.params.id, { include: Product });
    if (!category) return res.status(404).send();
    res.status(200).json(category);
  },

  // Get category by slug
  async getBySlug(req, res) {
    const { slug } = req.query;
    const categories = await Category.findAll({ where: { slug }, include: Product });
    res.status(200).json(categories);
  },

  // Create category
  async create(req, res) {
    try {
      const { namn, image, slug } = req.body;
      if (!namn) return res.status(400).json({ errors: { namn: 'Required' } });
      const category = await Category.create({ namn, image, slug });
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ errors: err.errors });
    }
  },

  // Update category
  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).send();
      const { op, path, value } = req.body;
      if (op === 'replace' && path !== '/id') {
        const field = path.replace('/', '');
        category[field] = value;
        await category.save();
        return res.status(204).json(category);
      }
      res.status(400).json({ errors: 'Invalid operation' });
    } catch (err) {
      res.status(400).json({ errors: err.errors });
    }
  },

  // Delete category
  async remove(req, res) {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send();
    await category.destroy();
    res.status(204).send();
  },

  // Add product to category
  async addProduct(req, res) {
    const category = await Category.findByPk(req.params.categoryID);
    const product = await Product.findByPk(req.params.productId);
    if (!category || !product) return res.status(404).send();
    await category.addProduct(product);
    res.status(204).send();
  },

  // Remove product from category
  async removeProduct(req, res) {
    const category = await Category.findByPk(req.params.categoryID);
    const product = await Product.findByPk(req.params.productId);
    if (!category || !product) return res.status(404).send();
    await category.removeProduct(product);
    res.status(204).send();
  },
};
