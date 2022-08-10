const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//TO DO - /checar token /checar autorizacao

//CADASTRAR
exports.cadastrar = async (req, res) => {
  //Confere se o cpf ou cnpj ja esta cadastrado
  //const { documento } = req.body;

  try {
    //  if (await Usuario.findOne({ documento }))
    //    return res.status(400).send({ error: "Documento já cadastrado" });

    const usuario = await Usuario.create(req.body);
    usuario.senha = undefined;

    return res.status(201).send({ usuario });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};

//USUARIO POR ID
exports.usuario = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    res.status(200).send(usuario);
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
  }
};

//LOGIN
exports.login = async (req, res) => {
  const { documento, senha } = req.body;
  const user = await Usuario.findOne({ documento: documento });

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado!" });
  }

  const checkPassword = await bcrypt.compare(senha, user.senha);

  if (!checkPassword) {
    return res.status(422).send({ message: "Senha inválida" });
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res
      .status(200)
      .send({ message: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

//EDITAR USUARIO
exports.editar = async (req, res) => {
  const usuario = req.body;
  try {
    await Usuario.updateOne({ _id: req.params.id }, usuario);
    return res.status(200).send({ message: "Perfil alterado com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar ao atualizar" + error });
  }
};

exports.cadastrarent = async (req, res) => {
  //Confere se o cpf ou cnpj ja esta cadastrado
  const { documento, email, senha, acesso } = req.body;

  try {
    //  if (await Usuario.findOne({ documento }))
    //    return res.status(400).send({ error: "Documento já cadastrado" });
    const usuario = await Usuario.create({ documento, email, senha, acesso });
    usuario.senha = undefined;
    const userid = usuario.id;

    const entidade = new Entidade(req.body);
    entidade.userid = userid;
    await entidade.save();

    return res.status(201).send({ usuario , entidade });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};
