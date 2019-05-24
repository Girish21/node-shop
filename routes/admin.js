const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const authGuard = require('../middleware/isAuth')

const router = express.Router();

// // /admin/add-product => GET
router.get('/add-product', authGuard, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', authGuard, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product', authGuard, adminController.postAddProduct);

router.get('/edit-product/:productId', authGuard, adminController.getEditProduct);

router.post('/edit-product', authGuard, adminController.postEditProduct);

router.post('/delete-product', authGuard, adminController.postDeleteProduct);

module.exports = router;
