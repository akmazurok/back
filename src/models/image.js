const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");

const s3 = new aws.S3();

// Image Schema
const ImageSchema = new Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ImageSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

ImageSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE == "s3") {
    return s3
      .deleteObject({
        Bucket: "uploadev",
        Key: this.key,
      })
      .promise();
  } else {
  }
});

//https://pt.stackoverflow.com/questions/419921/adicionar-imagens-no-mongodb-via-api-usando-o-postman
module.exports = new mongoose.model("Image", ImageSchema);
