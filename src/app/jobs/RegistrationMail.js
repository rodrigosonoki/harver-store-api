const Mail = require("../lib/Mail");

const RegistrationMail = {
  key: "RegistrationMail",
  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      from: "Queue Test <queue@queuetest.com.br>",
      to: `${user.email} <${user.email}>`,
      subject: "Cadastro de usuário",
      html: `Olá, ${user.email}, bem-vindo ao sistema de filas da Rocketseat :D ${user.avatar}`,
    });
  },
};

module.exports = RegistrationMail;
