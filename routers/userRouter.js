const express = require('express');
const {register, login, logout, getUserProfile, updateProfile, updatePassword} = require("../controllers/userController")
const userRouter = express.Router();
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout',logout);
userRouter.get('/profile', getUserProfile);
userRouter.post('/update-profile', updateProfile);
userRouter.post('/update-password',updatePassword);
module.exports = userRouter;