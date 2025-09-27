const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/categories
router.get('/', categoriesController.list);
// GET /api/categories/:id
router.get('/:id', categoriesController.getById);
// GET /api/categories?slug={slug}
router.get('/', categoriesController.getBySlug);
// POST /api/categories (admin only)
router.post('/', authenticateToken, requireAdmin, categoriesController.create);
// PATCH /api/categories/:id (admin only)
router.patch('/:id', authenticateToken, requireAdmin, categoriesController.update);
// DELETE /api/categories/:id (admin only)
router.delete('/:id', authenticateToken, requireAdmin, categoriesController.remove);
// PUT /api/categories/:categoryID/products/:productId (admin only)
router.put('/:categoryID/products/:productId', authenticateToken, requireAdmin, categoriesController.addProduct);
// DELETE /api/categories/:categoryID/products/:productId (admin only)
router.delete('/:categoryID/products/:productId', authenticateToken, requireAdmin, categoriesController.removeProduct);

module.exports = router;
