const nodemailer = require('nodemailer');
const { config } = require('../../../../config/config');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465, //Secure port
  auth: {
    user: config.smtpEmail,
    pass: config.smtpPass
  }
});

const sendMail = async (mailOptions) => {
  await transporter.sendMail(mailOptions);
  return { message: 'Mail sent', success: true }
}

module.exports = { sendEmail: sendMail };
