const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const sendResetPasswordEmail = async (email, resetUrl) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const templatePath = path.join(__dirname, '../views/email/resetPassword.ejs');
        const html = await ejs.renderFile(templatePath, { resetUrl });

        const mailOptions = {
            from: '"Auth Support" <noreply@example.com>',
            to: email,
            subject: 'Password Reset Request',
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);

        // Preview only available when sending through an Ethereal account
        if (process.env.NODE_ENV !== 'production' && process.env.EMAIL_HOST.includes('ethereal')) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = { sendResetPasswordEmail };
