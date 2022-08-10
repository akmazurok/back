const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Arrumar Schema para tipos de imagens
// Image Schema
const imageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
});

//https://pt.stackoverflow.com/questions/419921/adicionar-imagens-no-mongodb-via-api-usando-o-postman
module.exports = new mongoose.model("Image", imageSchema);