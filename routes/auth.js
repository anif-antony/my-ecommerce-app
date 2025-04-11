const express = require('express');
const router = express.Router();
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/authenticate');
const { registerUser,
        loginUser,
        logoutUser,
        forgotPassword,
        resetPassword,
        getUserProfile,
        updatePassword,
        updateProfile,
        getAllUsers,
        getSingleUser,
        updateUserRole,
        deleteUser
    } = require('../controllers/authController');

// Route for user registration
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/password/change').put(isAuthenticatedUser, updatePassword);
router.route('/update').put(isAuthenticatedUser, updateProfile);


//Admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getSingleUser);
router.route('/admin/user/:id').put(isAuthenticatedUser,authorizeRoles('admin'), updateUserRole);
router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);




module.exports = router;
