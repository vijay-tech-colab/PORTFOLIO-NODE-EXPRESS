const jwt = require('jsonwebtoken');
const ErrorHandler = require('./errorClass');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return next(new ErrorHandler('No token provided', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
};

module.exports = authMiddleware;