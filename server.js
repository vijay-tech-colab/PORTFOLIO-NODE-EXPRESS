const app = require("./app");
const dbConnection = require("./Db/connectionDb");
const PORT = process.env.PORT || 3000

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT,() =>{
    dbConnection();
    console.log("server running on....")
})