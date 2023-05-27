const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

// Arquivo Schema
const UploadSchema = new Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UploadSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

UploadSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: "uploadev",
        Key: this.key,
      })
      .promise();
  } else {
    return promisify(fs.unlink)(path.resolve(__dirname, "..","..", "tmp", "uploads", this.key));
  }
});

module.exports = new mongoose.model("Arquivo", UploadSchema);
