const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { RefreshToken, BlackList } = require("../models/token");

//VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
exports.verificarLogin = async (req, res) => {
  const { login } = req.body;

  var cadastro = false;
  var usuario = null;

  try {
    if ((usuario = await Usuario.findOne({ login }).select("statusPerfil"))) {
      if (
        usuario.statusPerfil == "PENDENTE" ||
        usuario.statusPerfil == "APROVADO"
      )
        cadastro = true;
      if (usuario.statusPerfil == "DESATIVADO") cadastro = true;
      if (usuario.statusPerfil == "REPROVADO") cadastro = false;
      return res.status(200).send({ cadastro, usuario });
    }
    return res.status(200).send({ message: "Não encontrado", cadastro });
  } catch (error) {
    return res.status(400).send({ message: "Erro" + error });
  }
};

//CADASTRAR
exports.cadastrar = async (req, res) => {
  const { login, senha, perfil, nome } = req.body;

  try {
    //Confere se o cpf ou cnpj ja esta cadastrado
    if (await Usuario.findOne({ login }))
      return res.status(200).send({ message: "Usuário já cadastrado" });

    const usuario = await Usuario.create({ login, senha, perfil, nome });
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

//ESQUECI MINHA SENHA
exports.esqueciSenha = async (req, res) => {
  const { login } = req.body;

  let usuarioDados;

  try {
    const usuario = await Usuario.findOne({ login });
    if(login.length > 11){
      usuarioDados = await Estudante.findOne({ _id: usuario._id });
    }else{
      usuarioDados = await Entidade.findOne({ _id: usuario._id });
    }

    novaSenha = Math.random().toString(36).substring(0, 7);

    await Usuario.updateOne({ login: login}, novaSenha);

    const transport = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: "testeparaotcc@outlook.com",
        pass: "Ufpr@123",
      },
    });   

    transport
      .sendMail({
        from: "Estudante Voluntário <testeparaotcc@outlook.com>",
        to: usuarioDados.email,
        subject: "Nova Senha - Estudante Voluntário",
        html: `
        <h1>Olá, ${usuario.nome}! </h1>        
        <p>Recebemos sua solicitação para alterar sua senha.</p>
        <p>Por gentileza, acesse a página e clique no menu a esquerda em Perfil, após isso vá até o final da página e crie uma nova senha.</p>
        <p>Sua senha atual é: <b>${novaSenha}</b></p>
    `,
      })
      .then(() => {
        return res.status(200).send({ message: "E-mail eviado com sucesso!" });
      })
      .catch((err) => {
        return res.status(500).send({ message: "Erro ao enviar e-mail: " + err });        
      });
  
  } catch (error) {
    return res.status(404).send({ message: "Usuário não encontrado!" });
  }
};

//LOGIN
exports.login = async (req, res) => {
  const { login, senha } = req.body;

  const user = await Usuario.findOne({ login: login });

  try {
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado!" });
    }
    const checkPassword = bcrypt.compareSync(senha, user.senha);
    if (!checkPassword) {
      return res.status(401).send({ message: "Senha inválida" });
    }
    if (user.statusPerfil == "PENDENTE") {
      return res.status(200).send({
        message: "Usuário com perfil em análise",
        statusPerfil: user.statusPerfil,
      });
    }
    if (user.statusPerfil == "DESATIVADO") {
      return res.status(200).send({
        message: "Usuário com perfil desativado",
        statusPerfil: user.statusPerfil,
      });
    }

    await RefreshToken.findOneAndDelete({ userId: user.id });

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: 3600 });
    const refresh = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "10d" }
    );

    await RefreshToken.create({ refresh, userId: user._id });

    //Retirar a senha
    user.senha = undefined;
    res.status(200).send({
      message: "Autenticação realizada com sucesso!",
      token,
      refresh,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erro ao realizar a autenticação" + error });
  }
};

//DESATIVAR USUARIO
exports.desativar = async (req, res) => {
  const user = await Usuario.findOne({ _id: req.params.id });

  try {
    await Usuario.updateOne(
      { _id: req.params.id },
      { $set: { statusPerfil: "DESATIVADO" } }
    );
    return res.status(200).send({ message: "Perfil desativado com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível desativar o perfil " + error });
  }
};

//REATIVAR USUARIO
exports.reativar = async (req, res) => {
  const { login } = req.body;

  try {
    await Usuario.updateOne(
      { login: login },
      { $set: { statusPerfil: "APROVADO" } }
    );
    return res.status(200).send({ message: "Perfil reativado com sucesso!" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível reativar o perfil " + error });
  }
};

//VERIFICAR TOKEN
exports.verificarToken = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth)
    return res
      .status(401)
      .send({ message: "Não autorizado, favor entrar no sistema novamente" });

  var [, token] = auth.split(" ");

  try {
    if (await BlackList.findOne({ token }))
      return res.status(400).send({ message: "Token inválido" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) return res.status(401).send({ message: "Token expirado" });

      //salva o id do usuario no request
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    res.status(400).send({ message: "Token inválido" });
  }
};

//REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const refresh = req.body.refresh;
  const userId = req.body.userId;

  try {
    const busca = await RefreshToken.find({ refresh });
    if (!busca) return res.status(404).send({ message: "Sessão expirada" });

    jwt.verify(
      refresh,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decode) => {
        if (err) return res.status(400).send({ message: "Sessão expirada" });
    
        if (decode) await RefreshToken.findOneAndDelete({ userId: userId });
        const token = jwt.sign(
          { id: userId },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 3600,
          }
        );
        const newRefresh = jwt.sign(
          { id: userId },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "10d" }
        );
        
        await RefreshToken.create({ userId, refresh: newRefresh });
      
        return res
          .status(200)
          .send({ message: "Sessão renovada", token, newRefresh });
      }
    );
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível renovar a sessão", error });
  }
};

//LOGOUT
exports.logout = async (req, res) => {
  const token = req.headers.authorization;
  try {
    await BlackList.create({ token });
    return res
      .status(200)
      .send({ message: "Usuário desconectado com sucesso!" });
  } catch (error) {
    return res.status(400).send({ message: "Não foi possível desconectar" });
  }
};
