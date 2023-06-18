const Usuario = require("../models/usuario").Usuario;
const Entidade = require("../models/usuario").Entidade;
const Estudante = require("../models/usuario").Estudante;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { RefreshToken, BlackList } = require("../models/token");

//VERIFICAR SE O LOGIN ESTÁ CADASTRADO - funcionando no postman
exports.verificarLogin = async (req, res) => {
  const { login } = req.body;
  console.log(login);
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
    return res.status(404).send({ message: "Não encontrado", cadastro });
  } catch (error) {
    return res.status(400).send({ message: "Erro" + error });
  }
};

//CADASTRAR - OK
exports.cadastrar = async (req, res) => {
  const { login, senha, perfil, nome } = req.body;

  try {
    //Confere se o cpf ou cnpj ja esta cadastrado
    if (await Usuario.findOne({ login }))
      return res.status(200).send({ message: "Usuário já cadastrado" });

    const usuario = await Usuario.create({
      login,
      senha,
      perfil,
      nome,
    });
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
    return res.status(401).send({ message: "Senha inválida" });
  }
  if (user.statusPerfil == "PENDENTE") {
    return res.status(200).send({
      message: "Usuário com perfil em análise",
      statusPerfil: user.statusPerfil,
    });
  }
  if (user.statusPerfil == "DESATIVADO") {
    return res.status(200).send({ message: "Usuário com perfil desativado" });
  }

  //const userRef = JSON.stringify(user._id);
 // await RefreshToken.findByIdAndDelete({ userid: userRef });

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: 60 }); //testar se expira
    const refresh = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    //await RefreshToken.create({ refresh, userId: user._id });

    //Retirar a senha
    user.senha = undefined;

    res
      .status(200)
      .send({
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

//DESATIVAR USUARIO - ok
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

//REATIVAR USUARIO - ok
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

exports.verificarToken = async (req, res) => {
  const token = req.headers.authorization;

  try {
    if (await BlackList.findOne({ token }))
      return res.status(400).send({ message: "Token inválido" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) return res.status(401).send({ message: "Token expirado" });
      req.userId = decode.userId;
      next();
    });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possivel realizar a busca" });
  }
};

exports.refreshToken = async (req, res) => {
  const refresh = req.headers.authorization;
  try {
    const busca = await RefreshToken.findOne({ refresh });
    if (!busca) return res.status(404).send({ message: "Sessão expirada" });

    const userid = busca?.userId;

    jwt.verify(
      refresh,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decode) => {
        if (err) return res.status(400).send({ message: "Sessão expirada" });

        if (decode) await RefreshToken.findOneAndDelete({ refresh });
        const newToken = jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 3600,
        });
        const newRefresh = jwt.sign(
          { id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        await RefreshToken.create({ refresh: newRefresh }, userid);

        return res
          .status(200)
          .send({ message: "Sessão renovada", newToken, newRefresh });
      }
    );
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Não foi possível renovar a sessão", error });
  }
};

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
