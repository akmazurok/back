var mongoose = require("mongoose");

const nodemailer = require('nodemailer');

const Notificacao = require("../models/notificacao");

//GERAR NOTIFICAÇÂO
exports.gerarNotificacao = async (req, res) => {
  const { idRemetente, idDestinatario, titulo, mensagem } = req.body;
  try {
    await Notificacao.create({
      idRemetente,
      idDestinatario,
      titulo,
      mensagem,
    });
    res.status(201).send({ message: "Notificação gerada com sucesso!" });
  } catch (error) {
    res.status(400).send({ message: "Erro ao gerar a notificação " + error });
  }
};

//DESTINATÁRIO LISTA NOTIFICAÇÕES RECEBIDAS
exports.listarNotificacoes = async (req, res) => {
 
  try {
    const notificacoes = await Notificacao.find({
      idDestinatario: req.params.idUsuario,
    }).populate({
      path: "idRemetente",
      select: "nome",
    });

    res.status(200).send(notificacoes);
  } catch (error) {
    res
      .status(404)
      .send({ message: "Não foram encontradas notificações" + error });
  }
};

//DESTINATÁRIO EXCLUI NOTIFICAÇÕES
exports.excluirNotificacao = async (req, res) => { 
  try {
    await Notificacao.findByIdAndRemove({ _id: req.params.id });
    res.status(200).send({ message: "Notificação excluída com sucesso." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível excluir a Notificação: " + error });
  }
};
