const Vaga = require("../models/vaga");
const Entidade = require("../models/usuario").Entidade;
const Usuario = require("../models/usuario").Usuario;
//TO-DO - /ver inscritos /aprovar inscritos

//CADASTRAR VAGA
exports.cadastrarVaga = async (req, res) => {
  //const entidade = req.params;
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

//LISTAR VAGAS
exports.listarVagas = async (req, res) => {
  //const ies = await Instituicao.findOne({ _id: req.params.id });
  //  const entidade = req.params;
  try {
    const vagas = await Vaga.find({ "entidade.id": req.params });
    res.status(200).send({ vagas });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};

//EDITAR VAGA
exports.editarVaga = async (req, res) => {
  const { idvaga } = req.params;
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

//VISUALIZAR VAGA
exports.vaga = async (req, res) => {
  const { id, idvaga } = req.params;
  try {
    const vaga = await Vaga.findOne({ _id: idvaga });
    res.status(200).send(vaga);
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//ENTIDADE POR ID
exports.entidade = async (req, res) => {
  try {
    const entidade = await Entidade.findOne({ _id: req.params.id });
   // const usuario = await Usuario.find({ userid: entidade.userid }, "-senha");
    res.status(200).send({entidade});
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//USUARIO POR ID
exports.usuario = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    const estudante = await Estudante.find({ userid: req.params.id });
    res.status(200).send({usuario, estudante});
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR ENTIDADE
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
