const catchAsyncError = require("../middlewares/catchAsyncError")
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')
const { sendEmail } = require('../utils/email')
const crypto = require('crypto')




//register user => /api/v1/register
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


//login user => /api/v1/login
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

//get logout user => /api/v1/logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}
);

//forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {    
    const user = await User.findOne({ email: req.body.email }).select("+password")
       
       if (!user) {
           return next(new ErrorHandler("User not found", 404));
       }
         const resetToken = user.getResetPasswordToken();
         await user.save({ validateBeforeSave: false });

         const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
         const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;
         
         try {
             await sendEmail({
                 email: user.email,
                 subject: `Ecommerce Password Recovery`,
                 message,
             });
         
             res.status(200).json({
                 success: true,
                 message: `Email sent to ${user.email} successfully`,
             });
         }
            catch (error) {
                user.resetPasswordToken = undefined;
                 user.resetPasswordTokenExpire = undefined;
                await user.save({ validateBeforeSave: false });
              return next(new ErrorHandler(error.message, 500));
         }        
        });


//reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
      req.params.token = req.params.token.replace(/ /g, "+");
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: { $gt: Date.now() },
        });
        if (!user) {
            return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
        }
        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password does not match", 400));
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        sendToken(user, 200, res);

    }
);


//get user profile => /api/v1/me

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
      const user = await User.findById(req.user.id);
      if (!user) {
          return next(new ErrorHandler("User not found", 404));
      }
        res.status(200).json({
            success: true,
            user,
        });
    }
);



//change password => /api/v1/password/change
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.isValidPassword(req.body.oldPassword);
    

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    if (req.body.oldPassword === req.body.newPassword) {
        return next(new ErrorHandler("New password cannot be same as old password", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

//update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.body.avatar !== "") {
        newUserData.avatar = req.body.avatar;
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});


//Admin routes

//get all users => /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});


//get single user => /api/v1/admin/user/:id
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});


//update user role => /api/v1/admin/user/:id
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    if (req.body.avatar !== "") {
        newUserData.avatar = req.body.avatar;
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});



//delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    await user.deleteOne(); 
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
