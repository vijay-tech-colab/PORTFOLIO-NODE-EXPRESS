const nodeMailer = require('nodemailer');
const sendEmail = async (mailOptions) => {
    const nodemailer = require('nodemailer');

    // Create transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });



    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("sent email..")
}

module.exports = sendEmail