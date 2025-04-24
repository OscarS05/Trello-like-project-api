const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { config } = require('../../../../config/config');


class SendEmailConfirmationUseCase{
  constructor({ AuthRedis }, { UserRepository }){
    this.AuthRedis = AuthRedis;
    this.UserRepository = UserRepository;
  }

  async execute(user){
    const payload = { sub: user.id, role: user.role};
    const token = jwt.sign(payload, config.jwtSecretVerifyEmail, { expiresIn: '30min' });

    await this.AuthRedis.saveTokenInRedis(user.id, token);

    const link = `${config.frontUrl}/auth/verify-email/email-confirmed?token=${token}`
    const mailOptions = {
      from: config.smtpEmail,
      to: `${user.email}`,
      subject: "Click on the link to confirm email",
      html: `<b>Click here: ${link}</b>`,
    }

    const send = await this.sendMail(mailOptions);
    return { message: send.message, token };
  }

  async sendMail(mailOptions) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465, //Secure port
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPass
      }
    });

    await transporter.sendMail(mailOptions);
    return { message: 'Mail sent' }
  }
}

module.exports = SendEmailConfirmationUseCase;
