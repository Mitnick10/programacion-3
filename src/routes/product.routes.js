const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/products', productController.getAllProducts);
router.post('/products', upload.single('imagen'), productController.createProduct);
router.delete('/products/:id', productController.deleteProduct);

router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);

router.get('/admin/backup', productController.backupProducts);

module.exports = router;
