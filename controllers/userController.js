const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // Middleware to handle asynchronous errors
const ErrorHandler = require("../middleware/errorClass"); // Custom error handler class
const User = require('../models/userSchema'); // Mongoose schema for the User model
const sendToken = require('../utils/sendToken'); // Utility to send JWT token to the user
const cloudinary = require('cloudinary').v2; // Cloudinary module for image upload

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
