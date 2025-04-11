const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const { newOrder,getSingleOrder ,getLoginAllOrders,updateOrderStatus,getAllOrders} = require('../controllers/orderController');

// Create new order
router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser, getLoginAllOrders);


// Admin routes
router.route('/orders').get(isAuthenticatedUser, getAllOrders);
router.route('/orders/:id').put(isAuthenticatedUser, updateOrderStatus);

module.exports = router;