const Vaga = require("../models/vaga");
const Usuario = require("../models/usuario");

//TO-DO - /cadastrar vaga /ver vagas /ver inscritos /aprovar inscritos /retornar entidade /atualizar entidade

exports.cadastrarVaga = async (req, res) => {
 
    try {
      const vaga = await Vaga.create(req.body);
      await Usuario.updateOne(
        { _id: req.params.id },
        { $push: { vagas: vaga } }
      );
      return res.status(201).send({ message: "Vaga criada com sucesso! " , vaga: vaga });
    } catch (error) {
      return res.status(400).send({ message: "Não foi possível cadastrar a vaga: " + error });
    }
  };    

exports.listarVagas = async (req, res) => {
    //const ies = await Instituicao.findOne({ _id: req.params.id });
   // const entidade = req.param
  try {
    const vagas = await Vaga.find({instituicao: req.params});
    res.status(200).send({ vagas });
  } catch (error) {
    res.status(404).send({ message: "Vagas não localizadas" + error });
  }
};
