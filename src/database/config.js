const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      //conexao mongodb atlas
      /*   `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@estudantevoluntario.vy1b0.mongodb.net/?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } */

      //conexao mongodb local
      "mongodb://localhost:27017/estudantevoluntario",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    return console.log(error);
  }
};

module.exports = connectToDatabase;
