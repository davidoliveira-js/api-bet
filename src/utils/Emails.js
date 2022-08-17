const nodemailer = require('nodemailer');

const testEmailConfig = (testAccount) => ({
  host: 'smtp.ethereal.email',
  auth: testAccount,
});

const productionEmailConfig = {
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
};

module.exports = {
  async createEmailConfig() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
      return productionEmailConfig;
    } else {
      const testAccount = await nodemailer.createTestAccount();
      return testEmailConfig(testAccount);
    }
  },

  async sendEmail(email, address) {
    const emailConfig = await this.createEmailConfig();
    const sender = nodemailer.createTransport(emailConfig);
    const info = await sender.sendMail({
      from: '"API David "<davidoliveiramail94@gmail.com>',
      to: email,
      subject: 'Verificação de email',
      text: `Olá! Verifique seu e-mail aqui: ${address}`,
      html: `<h1>Olá!</h1> Verifique seu e-mail aqui: <a href="${address}">${address}</a>`,
    });
    if (process.env.NODE_ENV != 'production') {
      console.log(nodemailer.getTestMessageUrl(info));
    }
  },
};
