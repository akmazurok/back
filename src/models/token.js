const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
    refresh: {type: String, require},
    userId: {type: String, require}
});

const BlackListSchema = new mongoose.Schema({
  token: { type: String, require, expires: 60 * 5 },
});


var RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
var BlackList = mongoose.model("BlackList", BlackListSchema);


module.exports = {
  RefreshToken: RefreshToken,
  BlackList: BlackList, 
};
