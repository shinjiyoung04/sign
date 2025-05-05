const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

mongoose.connect(
  "mongodb+srv://shinspace04:OkBpxI4haoTAenM7@cluster.k4no5nf.mongodb.net/signatures?retryWrites=true&w=majority"
);

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB 연결 성공!");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB 연결 실패:", err);
});

const SignatureSchema = new mongoose.Schema({
  image: String,
  hash: String,
  createdAt: { type: Date, default: Date.now },
});

const Signature = mongoose.model("Signature", SignatureSchema);

app.post("/api/signatures", async (req, res) => {
  const { image, hash } = req.body;
  try {
    const saved = await Signature.create({ image, hash });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "저장 실패", details: err });
  }
});

app.get("/api/signatures", async (req, res) => {
  try {
    const signatures = await Signature.find().sort({ createdAt: -1 });
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ error: "조회 실패", details: err });
  }
});

app.listen(3001, () => {
  console.log("✅ 서버 실행 중: http://localhost:3001");
});
