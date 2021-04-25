const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_MAIL_API_KEY);

module.exports = {
  sgMail,
};
