const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // Middleware to handle asynchronous errors
const ErrorHandler = require("../middleware/errorClass"); // Custom error handler class
const User = require('../models/userSchema'); // Mongoose schema for the User model
const sendToken = require('../utils/sendToken'); // Utility to send JWT token to the user
const cloudinary = require('cloudinary').v2; // Cloudinary module for image upload
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Utility to send emails

// Register a new user
exports.register = catchAsyncErrors(async (req, res, next) => {
    // Extract fields from the request body
    const {
        name,
        email,
        password,
        bio,
        linkedin,
        github,
        twitter,
        portfolio,
        phone,
        address
    } = req.body;

    // Extract avatar (image) from the request files
    const { avatar } = req.files;
    console.log(avatar)
    // Validate required fields
    if (!name || !password || !email) {
        return next(new ErrorHandler('Please fill all the fields', 400)); // Send error if required fields are missing
    }

    // Validate avatar presence and structure
    if (!avatar || Object.keys(req.files).length === 0 || Object.keys(avatar).length === 0) {
        return next(new ErrorHandler('Please upload an avatar', 400)); // Send error if no avatar is uploaded
    }

    // Validate avatar file size
    if (avatar.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorHandler('Please upload an image less than 1MB', 400)); // Send error if file size exceeds limit
    }

    console.log(avatar); // Log the avatar object for debugging

    // Upload avatar to Cloudinary
    const result = await cloudinary.uploader.upload(avatar.tempFilePath, {
        folder: 'AVATAR', // Specify the folder in Cloudinary where avatars will be stored
    });

    console.log("result ", result); // Log the Cloudinary response for debugging

    // Check if the upload was successful
    if (!result) {
        return next(new ErrorHandler('Something went wrong while uploading image', 500)); // Send error if upload fails
    }

    // Create a new user in the database
    const user = await User.create({
        name,
        email,
        password,
        bio,
        linkedin,
        github,
        twitter,
        portfolio,
        contact: {
            phone,
            address, // Store contact details as a nested object
        },
        avatar: {
            public_id: result.public_id, // Store public ID from Cloudinary
            url: result.secure_url, // Store secure URL from Cloudinary
        }
    });

    // Send token as a response for authentication purposes
    sendToken(user, 201, res);
});

// Login an existing user
exports.login = catchAsyncErrors(async (req, res, next) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400)); // Send error if required fields are missing
    }

    // Find user by email in the database
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401)); // Send error if user does not exist or password is incorrect
    }

    // Send token as a response for authentication purposes 
    sendToken(user, 200, res);
});

// Logout a user
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', '', {
        expires : new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const specificUser = await User.findById(req.user.id).select("+password"); // Find the user by ID in the database
    // Initialize an empty object to hold the new user data
    const newUserData = {};
    // Destructure fields from the request body
    const {
        name,
        email,
        bio,
        linkedin,
        github,
        twitter,
        portfolio,
        phone,
        address
    } = req.body;

    // Add fields to newUserData if they are provided in the request body
    if (name) newUserData.name = name;
    if (email) newUserData.email = email;
    if (bio) newUserData.bio = bio;
    if (linkedin) newUserData.linkedin = linkedin;
    if (github) newUserData.github = github;
    if (twitter) newUserData.twitter = twitter;
    if (portfolio) newUserData.portfolio = portfolio;

    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar; // Get the avatar file
        if (avatar.size > process.env.MAX_FILE_UPLOAD) {
            return next(new ErrorHandler('Please upload an image less than 1MB', 400));
        }
    
        // Destroy the existing avatar from Cloudinary
        if (specificUser.avatar && specificUser.avatar.public_id) {
            await cloudinary.uploader.destroy(specificUser.avatar.public_id);
        }
    
        // Upload the new avatar to Cloudinary
        const result = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: 'AVATAR'
        });
    
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }
     
    // Ensure nested fields (like contact) exist before updating
    if (phone || address) {
        newUserData.contact = {}; // Initialize the contact object if it doesn't exist
        if (phone) newUserData.contact.phone = phone;
        if (address) newUserData.contact.address = address;
    }

    // Update the user document in the database
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, // Return the updated user document
        runValidators: true, // Validate the new data before updating
        useFindAndModify: false // Prevent deprecated warnings in Mongoose
    });

    // Return a success response with the updated user information
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user
    });
});

// Get user profile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    // Find the user by ID in the database
    const user = await User.findById(req.user.id);
    if(!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    res.status(200).json({
        success: true,
        user
    });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    // Find the user by ID in the database
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user.id).select('+password');
    // Check if the current password is correct
    const isMatched = await user.comparePassword(oldPassword);
    if(!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }
    user.password = newPassword
    await user.save();
    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
});