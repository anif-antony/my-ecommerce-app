const express = require('express');
const router = express.Router();
const { getProducts,newProduct,getSingleProduct,updateProduct,deleteProduct } = require('../controllers/productController');
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/authenticate');

// get all products - GET /api/v1/products
router.route('/products').get( isAuthenticatedUser,getProducts);

// get single product - GET /api/v1/product/:id
router.route('/product/:id').get(getSingleProduct);

// create prduct - POST /api/v1/product/new
router.route('/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);

// update product - PUT /api/v1/product/:id
router.route('/product/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct);

// delete product - DELETE /api/v1/product/:id
router.route('/product/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

module.exports = router;