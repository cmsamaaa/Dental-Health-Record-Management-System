const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = transporter;