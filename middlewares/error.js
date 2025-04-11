const { JsonWebTokenError } = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    let error = { ...err };
    error.message = err.message;

    // Development mode
    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack,
        });



    }

    // Production mode
    if (process.env.NODE_ENV === "production") {
        // Mongoose Validation Error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(val => val.message).join(", ");
            error = new ErrorHandler(message, 400);
           
        }

        // Mongoose CastError
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 400);
        }

        // Mongoose Duplicate Key Error
        if (err.code === 11000) {
            const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
            error = new ErrorHandler(message, 400);
        }
        if (err.code === 11000) {
            const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
            error = new ErrorHandler(message, 400);
        }
        if(err.name=== 'JsonWebTokenError'){
            const message = `Json Web Token is invalid. Please try again.`;
            error = new ErrorHandler(message, 400);
            
        }
        if(err.name === 'TokenExpiredError') {
            const message = `Json Web Token is expired. Please try again.`;
            error = new ErrorHandler(message, 400);
        }
        

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
