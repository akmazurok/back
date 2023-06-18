var mongoose = require("mongoose");
const Certificado = require("../models/certificado");

exports.gerarCertificado = async (req, res) => {
  try {

    
    console.log(sundays, saturdays);

    res.status(201).send({ message: "Notificação gerada com sucesso!" });
  } catch (error) {
    res.status(400).send({ message: "Erro ao gerar a notificação " + error });
  }
};
