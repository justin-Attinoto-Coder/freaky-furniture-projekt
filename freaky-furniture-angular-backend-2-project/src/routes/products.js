const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/products[?page=1&pageSize=10]
router.get('/', productsController.list);
// GET /api/products/:id
router.get('/:id', productsController.getById);
// GET /api/products?slug={slug}
router.get('/', productsController.getBySlug);
// POST /api/products (admin only)
router.post('/', authenticateToken, requireAdmin, productsController.create);
// PATCH /api/products/:id (admin only)
router.patch('/:id', authenticateToken, requireAdmin, productsController.update);
// DELETE /api/products/:id (admin only)
router.delete('/:id', authenticateToken, requireAdmin, productsController.remove);

module.exports = router;
