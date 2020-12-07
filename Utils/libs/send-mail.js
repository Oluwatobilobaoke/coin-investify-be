const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.COIN_INVESTIFY_SMTP_HOST,
    port: process.env.COIN_INVESTIFY_SMTP_PORT,
    auth: {
      user: process.env.COIN_INVESTIFY_SMTP_USER,
      pass: process.env.COIN_INVESTIFY_SMTP_PASSWORD,
    },
  });

  let adminEmail = process.env.COIN_INVESTIFY_TO_EMAIL,
   mailingList = [ options.email, adminEmail];
  
  const message = {
    from: `${process.env.COIN_INVESTIFY_EMAIL_FROM_NAME} <${process.env.COIN_INVESTIFY_FROM_EMAIL}>`,
    // to: options.email,
    to: mailingList,
    subject: options.subject,
    html: options.message,
  };

  if (options.subject === 'Inquiry on CoinInvestify') {
    message.from = `${options.fullName} <${options.email}>`;
    message.to = process.env.COIN_INVESTIFY_TO_EMAIL;
  }

  await transporter.sendMail(message);
};

module.exports.sendEmail = sendEmail;
