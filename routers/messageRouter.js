const express = require('express');
const { getMessages, sendMessages, deleteAllMessages, getMessageById, deleteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const messageRouter = express.Router();

messageRouter.get('/all-messages',authMiddleware,getMessages);
messageRouter.post('/send-message',sendMessages);
messageRouter.delete('/delete-all-messages',authMiddleware,deleteAllMessages);
messageRouter.get('/get-message/:id',authMiddleware,getMessageById);
messageRouter.delete('/delete-message/:id',authMiddleware,deleteMessage);
module.exports = messageRouter;