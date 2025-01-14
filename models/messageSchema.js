const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    senderEmail: {
        type: String,
        required: true,
        lowercase: true, // Ensures email is stored in lowercase
        validate: {
            validator: function (value) {
                // Email regex validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    message : {
        type: String, // Message content
        required: true,
        trim: true,
    },
    isRead: {
        type: Boolean, // Indicates if the message has been read
        default: false,
    },
    timestamp: {
        type: Date, // When the message was sent
        default: Date.now,
    },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
