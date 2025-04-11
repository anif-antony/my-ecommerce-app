const catchAsyncError = require("../middlewares/catchAsyncError")
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')

exports.registerUser=catchAsyncError(async(req,res,next)=>{
 const {name,email,password,avatar}=req.body

 const user = await User.create({
    name,
    email,
    password,
    avatar
 })

// const token = user.getJWTTOKEN();
const token = user.getJWTTOKEN();


sendToken(user,200,res);


})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.isValidPassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});
