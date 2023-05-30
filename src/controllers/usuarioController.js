const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//TO DO - /checar token /checar autorizacao /desativar usuario

//CADASTRAR - OK
exports.cadastrar = async (req, res) => {
  const { login, senha, perfil } = req.body;

  try {
    //Confere se o cpf ou cnpj ja esta cadastrado
    if (await Usuario.findOne({ login }))
      return res.status(200).send({ message: "Usuário já cadastrado" });

    const usuario = await Usuario.create({ login, senha, perfil });
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

    return res.status(201).send({ usuario, cadastro });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
};

//USUARIO POR ID - OK
exports.usuario = async (req, res) => {
  try {
    //Retorna o usuario sem a informacao da senha
    const usuario = await Usuario.findOne({ _id: req.params.id }, "-senha");
    res.status(200).send({ usuario });
  } catch (error) {
    res.status(404).send({ message: "Dados não encontrados " + error });
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
  
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    //Pensar o que trazer junto com a requisicao de login ok (só o id?)
    res
      .status(200)
      .send({ message: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erro ao realizar a autenticação" + error });
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

//DESATIVAR USUARIO
exports.desativar = async (req, res) => {
  //usuario precisa digitar a senha pra confirmar a ação
  const { senha , usuario } = req.body;
  
  const user = await Usuario.findOne({ _id: req.params.id });

  const checkPassword = await bcrypt.compare(senha, user.senha);

  if (!checkPassword) {
    return res.status(422).send({ message: "Senha inválida" });
  }

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


/* CODIGO ANTES DE MUDAR OS MODELS 
  
  exports.cadastrar = async (req, res) => {
  //Confere se o cpf ou cnpj ja esta cadastrado
  const { documento, email, senha, acesso } = req.body;

  try {
    //  if (await Usuario.findOne({ documento }))
    //    return res.status(400).send({ error: "Documento já cadastrado" });
    const usuario = await Usuario.create({ documento, email, senha, acesso });
    usuario.senha = undefined;
    const userid = usuario.id;

    var doc = documento;
    var cadastro = null;

    if (doc.length > 11) {
      cadastro = new Entidade(req.body);
    } else {
      cadastro = new Estudante(req.body);
    }
    cadastro.userid = userid;
    await cadastro.save();

    return res.status(201).send({ usuario, cadastro });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao realizar o cadastro " + error });
  }
}; */
