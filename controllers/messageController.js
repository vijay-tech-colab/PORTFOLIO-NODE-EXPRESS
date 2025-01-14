const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../middleware/errorClass");
const Message = require("../models/messageSchema");

// Controller to send a new message
exports.sendMessages = catchAsyncErrors(async (req, res, next) => {
    const { sender, senderEmail, message } = req.body;

    // Check if all required fields are provided
    if (!sender || !senderEmail || !message) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    // Create a new message
    const newMessage = await Message.create({
        sender,
        senderEmail,
        message
    });

    // Respond with success status and the created message
    res.status(201).json({
        success: true,
        message: newMessage
    });
});

// Controller to get paginated messages
exports.getMessages = catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    // Get the total number of messages
    const totalMessage = await Message.countDocuments();

    // Get the messages for the current page
    const messages = await Message.find().skip(skip).limit(limit);

    // Respond with success status, total messages count, and the messages
    res.status(200).json({
        success: true,
        totalMessage: totalMessage,
        messages
    });
});

// Controller to get a specific message by ID
exports.getMessageById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the message by ID
    const message = await Message.findById(id);

    // If message not found, return an error
    if (!message) {
        return next(new ErrorHandler("Message not found", 404));
    }

    // Respond with success status and the found message
    res.status(200).json({
        success: true,
        message
    });
});

// Controller to delete all messages
exports.deleteAllMessages = catchAsyncErrors(async (req, res, next) => {
    // Delete all messages from the database
    await Message.deleteMany({});

    // Respond with success status and a message
    res.status(200).json({
        success: true,
        message: "All messages have been deleted"
    });
});

// Controller to delete a specific message by ID
exports.deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the message by ID
    const message = await Message.findById(id);

    // If message not found, return an error
    if (!message) {
        return next(new ErrorHandler("Message not found", 404));
    }

    // Remove the message from the database
    await message.remove();

    // Respond with success status and a message
    res.status(200).json({
        success: true,
        message: "Message has been deleted"
    });
});
