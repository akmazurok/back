const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const storageTypes = {
  //LOCAL
  local: multer.diskStorage({
    destination: (req, res, callback) => {
      callback(null, path.resolve(__dirname, "../", "..", "tmp", "uploads"));
    },
    filename: (req, file, callback) => {
      crypto.randomBytes(8, (error, hash) => {
        if (error) callback(error);
        file.key = `${hash.toString("hex")}-${file.originalname}`;
        callback(null, file.key);
      });
    },
  }),

  //AMAZON S3
  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'uploadev',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, callback) => {
      crypto.randomBytes(8, (error, hash) => {
        if (error) callback(error);
        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        callback(null, fileName);
      });
    },
  }),
};

module.exports = {
  dest: path.resolve(__dirname, "../", "..", "tmp", "uploads"),
  //tipo de storage
  storage: storageTypes['s3'],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Formato inválido"));
    }
  },
};
