const express = require('express');
const router = express.Router();
const {
	getCategories,
	getCategoryById,
	getCategoryBySlug,
	createCategory,
	updateCategory,
	deleteCategory,
	addProductToCategory,
	removeProductFromCategory
} = require('../controllers/categoriesController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', (req, res, next) => {
	if (req.query.slug) return getCategoryBySlug(req, res, next);
	return getCategories(req, res, next);
});
router.get('/:id', getCategoryById);
router.post('/', authenticateToken, requireAdmin, createCategory);
router.patch('/:id', authenticateToken, requireAdmin, updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);
router.put('/:categoryID/products/:productId', authenticateToken, requireAdmin, addProductToCategory);
router.delete('/:categoryID/products/:productId', authenticateToken, requireAdmin, removeProductFromCategory);

module.exports = router;
