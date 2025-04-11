
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const qs = require("qs");
// Get all products => /api/v1/products
exports.getProducts = async (req, res) => {
  try {
    // Parse query string into nested objects
    const resultsPerPage = 2;
    const parsedQuery = qs.parse(req.query);

    const apiFeatures = new ApiFeatures(Product.find(), parsedQuery)
      .search()
      .filter()
      .paginate(resultsPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create product => /api/v1/product/new
exports.newProduct =catchAsyncError (async (req, res, next) => {
  req.body.user = req.user.id; // Add user ID to the request body
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});


//get Single Product => /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return next(new ErrorHandler('Product not found', 404));
      }
      res.status(200).json({ success: true, product });
  } catch (error) {
      next(error);
  }
};

// Update product => /api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
};


// Delete product => /api/v1/product/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};