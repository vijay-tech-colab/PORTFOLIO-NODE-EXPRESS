const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../middleware/errorClass");
const Message = require("../models/messageSchema");
const sendEmail = require("../utils/sendEmail");


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

    let mailOptions = {
        from: newMessage.senderEmail,
        to: process.env.EMAIL_USER,
        subject: 'Thank You for Reaching Out!',  // Subject of the email
        text: 'Hello, thank you for reaching out to us! Your message has been successfully received. We value your interest and will get back to you as soon as possible. In the meantime, feel free to explore more about us on our website. Have a great day!',  // Plain text body
        html: `
        <p>Hello,</p>
        <p>Thank you for reaching out to us! Your message has been <strong>successfully received</strong>.</p>
        <p>We truly appreciate your interest and will respond to you as soon as possible. In the meantime, feel free to <a href="https://yourwebsite.com" target="_blank">explore more about us</a>.</p>
        <p>If you have any further questions, don't hesitate to contact us directly.</p>`  // HTML body
    };

    await sendEmail(mailOptions);

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
