var mongoose = require("mongoose");
const Vaga = require("../models/vaga");
const Entidade = require("../models/usuario").Entidade;
const Usuario = require("../models/usuario").Usuario;

//TO-DO - /ver inscritos /aprovar inscritos

//CADASTRAR VAGA - OK
exports.cadastrarVaga = async (req, res) => {
  const vaga = new Vaga(req.body);
  vaga.entidade = req.params;

  try {
    await vaga.save();
    return res.status(201).send({ message: "Vaga criada com sucesso! ", vaga });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível cadastrar a vaga: " + error });
  }
};

//LISTAR VAGAS DA ENTIDADE - OK
exports.listarVagas = async (req, res) => {
  const entidade = mongoose.Types.ObjectId(req.params);
  try {
    const vagas = await Vaga.find({ "entidade.id": entidade });
    res.status(200).send({ vagas });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//VISUALIZAR VAGA - OK
exports.vaga = async (req, res) => {
  try {
    const vaga = await Vaga.findOne({ _id: req.params.vagaid });
    res.status(200).send(vaga);
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR VAGA - OK
exports.editarVaga = async (req, res) => {
  const idvaga = req.params.vagaid;
  const vaga = req.body;
  try {
    await Vaga.updateOne({ _id: idvaga }, vaga);
    return res.status(200).send({ message: "Vaga alterada com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

//ENTIDADE POR ID - OK
exports.entidade = async (req, res) => {
  try {
    const entidade = await Entidade.find({ _id: req.params.id });

    res.status(200).send({ entidade });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ENTIDADE - OK
exports.editarEntidade = async (req, res) => {
  const entidade = req.body;
  try {
    await Entidade.updateOne({ _id: req.params.id }, entidade);
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};
