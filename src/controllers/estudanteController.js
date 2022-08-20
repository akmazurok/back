var mongoose = require("mongoose");
const Vaga = require("../models/vaga");
const Entidade = require("../models/usuario").Estudante;
const Usuario = require("../models/usuario").Usuario;

//TO-DO - /visualizar estudante /editar estudante /se inscrever em vaga /colocar codigo para permissoes de editar e visualizar infos

//ESTUDANTE POR ID
exports.entidade = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({ _id: req.params.id });
    // const usuario = await Usuario.find({ userid: entidade.userid }, "-senha");
    res.status(200).send({ estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//USUARIO E ESTUDANTE POR ID - TESTAR
exports.usuario = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    const estudante = await Estudante.find({ userid: req.params.id });
    res.status(200).send({ usuario, estudante });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//EDITAR USUARIO E ESTUDANTE - arrumar para editar usuario e testar
exports.editarEstudante = async (req, res) => {
  const entidade = req.body;
  try {
    await Estudante.updateOne({ _id: req.params.id }, entidade);
	//await Usuario.updateOne({_id: entidade});
    return res.status(200).send({ message: "Dados alterados com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};
