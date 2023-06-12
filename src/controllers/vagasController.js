var mongoose = require("mongoose");
const Vaga = require("../models/vaga");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//CADASTRA VAGAS
exports.cadastrarVaga = async (req, res) => {
    const { vaga } = req.body;

    try {
    const vagaCadastrada = await Vaga.find({ nomeVaga: "req.body.nomeVaga" });
    const cadastro = new Vaga(req.body);
    await cadastro.save();

    // retorna usuario e admin pra mostrar nos testes

    return res
    .status(201)
    .send({ message: "Cadastro realizado com sucesso! ", cadastro });
  }catch(err){
    console.log(err)
    res
    .status(500)
    .send({ message: "Erro ao realizar o cadastro " + err });
  }

  };