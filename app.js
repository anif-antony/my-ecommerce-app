const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error'); // Import the error middleware
const cookieParser = require('cookie-parser'); // Import the cookie parser middleware
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());
const products = require('./routes/product'); // Import the product routes
const auth=require('./routes/auth');
const order=require('./routes/order');


app.use('/api/v1', products); // Use the product routes for the API version 1
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use(errorMiddleware); // Use the error handling middleware
module.exports = app; // Export the app for testing
