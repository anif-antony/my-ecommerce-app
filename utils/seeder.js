const products = require('../data/products.json');
const product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

dotenv.config({ path: 'backend/config/config.env' });

connectDatabase();

const seedProducts = async () => {
    try {
        await product.deleteMany();
        console.log('Products deleted');
        
        await product.insertMany(products); // ✅ use product data, not the model
        console.log('Products added');
        
        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

seedProducts();
