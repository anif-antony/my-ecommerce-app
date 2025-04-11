const Order = require('../models/orderModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');


exports.newOrder=async (req, res) => {
    const { orderItems, 
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo} = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No order items provided',
        });
    }

    const order = await Order.create({
            orderItems, 
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user._id,
        
    });

    res.status(201).json({
        success: true,
        order,
    });
}


// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new ErrorHandler(`Order not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
});


// Get all orders => /api/v1/myorders
exports.getLoginAllOrders = catchAsyncError(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });
});

//Admin get all orders => /api/v1/admin/orders
exports.getAllOrders = catchAsyncError(async (req, res) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// Update order status => /api/v1/admin/order/:id
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler(`Order not found with id: ${req.params.id}`, 404));
    }
    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400));
    }
    order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
    });
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});
