const Mail = require("../lib/Mail");

const ForgotPasswordMail = {
  key: "ForgotPasswordMail",
  async handle({ data }) {
    const { content } = data;
    await Mail.sendMail({
      from: "Queue Test <queue@queuetest.com.br>",
      to: `rosonoki@gmail.com`,
      subject: "Reset de senha",
      html: `Olá seu token é ${content.token} cliquei aqui ${content.url},`,
    });
  },
};

module.exports = ForgotPasswordMail;
