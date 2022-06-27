const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@estudantevoluntario.vy1b0.mongodb.net/?retryWrites=true&w=majority`
    );
	mongoose.Promise = global.Promise;
    console.log("Conexao ao BD realizada com sucesso");
  } catch (error) {
    return console.log("Ocorreu um erro ao conectar o BD");
  }
};

module.exports = connectToDatabase;