const mongoose = require("mongoose");

// Notificacao Schema
const NotificacaoSchema = new mongoose.Schema({
  idRemetente: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
  },

  idDestinatario: {
    type: mongoose.Types.ObjectId,
    ref: "Usuario",
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
