const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({
  title: String,
  content: String,
  hash: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  signed: {
    type: Boolean,
    default: false,
  },
  signer: String,
  signatureData: String, // base64 이미지
});

module.exports = mongoose.model("Contract", ContractSchema);
