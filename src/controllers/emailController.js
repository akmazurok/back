const nodemailer = require('nodemailer');
const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host: host,
    port: port,
    secure: false,
    auth: {
        user: user,
        pass: pass,
    }
});
novaSenha = Math.random().toString(36).substring(0, 7);

function enviarEmail(idUsuario){

transport.sendMail({
    from: 'Estudante Voluntário <testeparaotcc@outlook.com>',
    to: 'gustavoachinitz@gmail.com',
    subject: 'Nova Senha - Estudante Voluntário',
    html: `
        <h1>Olá, Gustavo! </h1>        
        <p>Recebemos sua solicitação para alterar sua senha.</p>
        <p>Por gentileza, acesse a página e clique no menu a esquerda em Perfil, após isso vá até o final da página e crie uma nova senha.</p>
        <p>Sua senha atual é: <b>${novaSenha}</b></p>
    `,
    text: 'Olá, Dev! Esse e-mail foi enviado o Nodemailer...',
}).then(
    () => {
        console.log('E-mail eviado com sucesso!')
    }
).catch(
    (err) => {
        console.log('Erro ao enviar e-mail: ' + err);
    }
);
};

module.exports = enviarEmail(idUsuario);