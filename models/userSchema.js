const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select : false
    },
    bio: {
        type: String,
        trim: true,
    },
    avatar: {
        public_id: { 
            type: String, 
            trim: true 
        },
        url: {
            type: String, 
            trim: true 
        },
    },
    resume : {
        public_id: { 
            type: String, 
            trim: true 
        },
        url: {
            type: String, 
            trim: true 
        },
    },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    contact: {
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
    },
    resetPasswordToken : String,
    resetPasswordExpires : Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
userSchema.pre('save', async function (next) {
    try {
        if(!this.isModified('password')) {
            next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        next(error)
    }
});
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.getSignedJwtToken = function () {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
        throw new Error("JWT_SECRET or JWT_EXPIRE is not defined in the environment variables");
    }
    
    return jwt.sign(
        { id: this._id }, // Payload
        process.env.JWT_SECRET, // Secret key
        {
            expiresIn: process.env.JWT_EXPIRE, // Expiration time
        }
    );
};


const User = mongoose.model('User', userSchema);

module.exports = User;
