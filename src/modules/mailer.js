const nodemailer = require('nodemailer');
const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host: host,
    port: port,
    secure: false,
    auth: { user, pass }
});

module.exports = transport;