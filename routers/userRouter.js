const express = require('express');

const {
    register, 
    login, 
    logout, 
    getUserProfile, 
    updateProfile, 
    updatePassword
} = require("../controllers/userController");

const authMiddleware = require('../middleware/authMiddleware');

const userRouter = express.Router(); // Create a new router object
userRouter.post('/register', register); // Register a new user
userRouter.post('/login',login); // Login a user
userRouter.post('/logout',authMiddleware,logout); // Logout a user
userRouter.get('/profile', authMiddleware,getUserProfile); // Get user profile
userRouter.post('/update-profile', authMiddleware,updateProfile); // Update user profile
userRouter.put('/change-password',authMiddleware,updatePassword); // Change user password
 
module.exports = userRouter;