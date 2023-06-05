const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//TO DO - /desativar usuario  /recuperar senha

//CADASTRAR - OK
exports.cadastrar = async (req, res) => {
  const { login, senha, perfil } = req.body;

  try {
    //Confere se o cpf ou cnpj ja esta cadastrado
    if (await Usuario.findOne({ login }))
      return res.status(200).send({ message: "Usuário já cadastrado" });

    const usuario = await Usuario.create({ login, senha, perfil, nome, statusPerfil });
    usuario.senha = undefined;
    const userid = usuario.id;

    var doc = login;
    var cadastro = null;

    if (doc.length > 11) {
      cadastro = new Entidade(req.body);
    } else {
      cadastro = new Estudante(req.body);
    }
    cadastro.userid = userid;
    await cadastro.save();

    //retorna usuario e estudante/entidade pra mostrar nos testes
    return res
      .status(201)
      .send({ message: "Cadastro realizado com sucesso! ", usuario, cadastro });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};

//LOGIN - OK
exports.login = async (req, res) => {
  const { login, senha } = req.body;
  const user = await Usuario.findOne({ login: login });

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado!" });
  }
  const checkPassword = await bcrypt.compare(senha, user.senha);
  if (!checkPassword) {
    return res.status(422).send({ message: "Senha inválida" });
  }
  if (!user.perfilAtivo) {
    return res.status(200).send({ message: "Usuário com perfil desativado" });
  }
  try {
    const secret = await process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    //Retirar a senha
    user.senha = undefined;

    res
      .status(200)
      .send({ message: "Autenticação realizada com sucesso!", token, user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erro ao realizar a autenticação" + error });
  }
};

//DESATIVAR USUARIO
exports.desativar = async (req, res) => {
  //usuario precisa digitar a senha pra confirmar a ação
  //const { senha } = req.body;
  const user = await Usuario.findOne({ _id: req.params.id });

  try {
    await Usuario.updateOne(
      { _id: req.params.id },
      { $set: { perfilAtivo: false } }
    );
    return res.status(200).send({ message: "Perfil alterado com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível desativar o perfil " + error });
  }
};