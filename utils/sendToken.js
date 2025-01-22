const sendEmail = require("./sendEmail");

const sendToken = async (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    let mailOptions = {
        from: user.email,
        to: process.env.EMAIL_USER,
        subject: 'Registration Successful',  // Subject of the email
        text: 'Hello, your registration was successful! Welcome to our platform.',  // Plain text body
        html: '<p>Hello, <strong>your registration was successful!</strong> Welcome to our platform.</p>'  // HTML body
    };

    await sendEmail(mailOptions);

    // Send response with token
    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,               // Indicates registration was successful
            message: "Registration successful!", // Custom success message
            token,                        // JWT token
            user: {
                id: user._id,             // Newly registered user's unique ID
                name: user.name,          // User's name
                email: user.email,        // User's email
            },
            expiresIn: process.env.JWT_EXPIRE, // Token expiration time (e.g., 7d)
            cookieExpiresIn: `${process.env.JWT_COOKIE_EXPIRE} days`, // Cookie expiration
            timestamp: new Date().toISOString(),
        });

};

module.exports = sendToken;