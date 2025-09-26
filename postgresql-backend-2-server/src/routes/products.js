const express = require('express');
const router = express.Router();
const {
	getProducts,
	getProductById,
	getProductBySlug,
	createProduct,
	updateProduct,
	deleteProduct
} = require('../controllers/productsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', (req, res, next) => {
	if (req.query.slug) return getProductBySlug(req, res, next);
	return getProducts(req, res, next);
});
router.get('/:id', getProductById);
router.post('/', authenticateToken, requireAdmin, createProduct);
router.patch('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

module.exports = router;
