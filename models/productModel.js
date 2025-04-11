const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

name:{
    type:String,
    required:[true,'Please enter product name'],
    trim:true,
    maxLength:[100,'Product name cannot exceed 100 characters']
},
price:{
    type:Number,
    required:[true,'Please enter product price'],
    default:0.0
},
description:{
    type:String,
    required:[true,'Please enter product description']
},
ratings:{
    type:String,
    default:0
},
images:[
    {
        image:{
            type:String,
            required:true
        }
    }
],
catagory:{
    type:String,
    required:[true,'Please enter product catagory'],
    enum:{
        values:[
            'Electronics',
            'Mobile Phones',
            'Smart Watches',
            'Cameras',
            'Laptops',
            'Accessories',
            'Headphones',
            'Food',
            'Books',
            'Clothes/Shoes',
            'Beauty/Health',
            'Sports',
            'Outdoor',
            'Home'
        ],
        message:'Please select correct catagory for product'
    }
},
seller:{
    type:String,
    required:[true,'Please enter product seller']
},
stoke:{
    type:Number,
    required:[true,'Please enter product stock'],
    maxLength:[20,'Stock cannot exceed 20 characters'],
    default:0
},
numOfReviews:{
    type:Number,
    default:0
},
reviews:[
    {
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }
],
createdAt:{
    type:Date,
    default:Date.now
}

})

let schema= mongoose.model('Product',productSchema);
module.exports=schema;