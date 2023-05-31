const mongoose = require("mongoose");

// Notificacao Schema
const NotificacaoSchema = new mongoose.Schema({
  destinatario: {
    id: { type: mongoose.Types.ObjectId, ref: "Usuario" },
    nome: { type: String },
  },

  remetente: {
    id: { type: mongoose.Types.ObjectId, ref: "Usuario" },
    nome: { type: String },
  },

  titulo: {
    type: String,
  },

  mensagem: {
    type: String,
  },

  data: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notificacao", NotificacaoSchema);
