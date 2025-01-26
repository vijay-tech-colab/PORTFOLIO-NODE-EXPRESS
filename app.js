// Import the express module
const express = require("express");
// Create an instance of express
const app = express();
// Import the express-fileupload module
const fileUpload = require("express-fileupload");
// Import the cookie-parser module
const cookieParser = require("cookie-parser");
// Import the custom error middleware
const errorMiddleware = require("./middleware/errorMiddleWare");
// Load environment variables from the .env file
require("dotenv").config({ path: "./config/config.env" });
// Import the cors module for enabling Cross-Origin Resource Sharing
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const compression = require('compression');
// Import the user router
const userRouter = require("./routers/userRouter");
// Import the skill router
const skillRouter = require("./routers/skillRouter");
// Import the project router
const projectRouter = require("./routers/projectRouter");
// Import the message router
const messageRouter = require("./routers/messageRouter");
// Import the helmet module for securing HTTP headers
const helmet = require("helmet");
// Import the morgan module for logging HTTP requests
const morgan = require("morgan");

// Middleware to secure HTTP headers
app.use(helmet());
// Middleware to enable CORS with specific options
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow these HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to log HTTP requests
app.use(morgan("dev"));
// Middleware to parse cookies
app.use(cookieParser());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Compression middleware
app.use(compression());

// Middleware to handle file uploads with temporary files
app.use(
  fileUpload({
    useTempFiles: true, // Use temporary files
    tempFileDir: "/tmp/", // Directory for temporary files
  })
);

// Route for user-related endpoints
app.use("/api/v1/users", userRouter);
// Route for skill-related endpoints
app.use("/api/v1/skill", skillRouter);
// Route for project-related endpoints
app.use("/api/v1/project", projectRouter);
// Route for message-related endpoints
app.use("/api/v1/message", messageRouter);

// Middleware to handle errors
app.use(errorMiddleware);

// Export the app module
module.exports = app;
