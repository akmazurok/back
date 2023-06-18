var mongoose = require("mongoose");
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const TermoAdesao = require("../models/termoAdesao");
const Inscricao = require("../models/inscricao");

//GERAR TERMO DE ADESAO - OK
exports.gerarTermo = async (req, res) => {
  const idInscricao = mongoose.Types.ObjectId(req.params.inscricaoid);

  try {
    const entidade = await Entidade.findOne({ userid: req.params.idUserEnt });
    const inscricao = await Inscricao.findById({ _id: req.params.inscricaoid });

    const termoAdesao = new TermoAdesao();
    termoAdesao.idInscricao = idInscricao;
    termoAdesao.idEntidade = entidade._id;
    termoAdesao.idEstudante = inscricao.estudanteId;
    termoAdesao.idVaga = inscricao.vagaId;
    termoAdesao.save();

    await Inscricao.updateOne(
      { _id: req.params.inscricaoid },
      { $set: { termoAdesaoId: termoAdesao._id } }
    );

    res.status(201).send({ message: "Termo gerado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a inscrição" + error });
  }
};

//VISUALIZAR TERMO
exports.visualizarTermo = async (req, res) => {
  try {
    const termo = await TermoAdesao.findById({ _id: req.params.termoid })
      .populate({
        path: "idEstudante",
        select:
          "nomeCompleto nomeSocial rg rgEmissor estadoCivil telefone email endereco",
        populate: {
          path: "userid",
          select: "login",
        },
      })
      .populate({
        path: "idEntidade",
        select: "razaoSocial nomeFantasia telefone email endereco",
        populate: {
          path: "userid",
          select: "login",
        },
      })
      .populate({
        path: "idVaga",
        select:
          "nomeVaga descricao requisitos dataInicioTrabalho dataEncerramentoTrabalho horarioInicioTrabalho horarioEncerramentoTrabalho",
      });

    res.status(200).send(termo);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Não foi possível completar a operação" + error });
  }
};
