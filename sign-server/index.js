// 📁 서버 파일: sign-server/index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

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

// 🔸 계약서 모델
const ContractSchema = new mongoose.Schema({
  title: String,
  content: String,
  hash: String,
  createdAt: { type: Date, default: Date.now },
  signed: { type: Boolean, default: false },
  signer: { type: String, default: "" },
  signatureData: { type: String, default: "" }, // 🔸 서명 이미지
});

const Contract = mongoose.model("Contract", ContractSchema);

// 🔸 서명 모델
const SignatureSchema = new mongoose.Schema({
  image: String,
  hash: String,
  createdAt: { type: Date, default: Date.now },
});

const Signature = mongoose.model("Signature", SignatureSchema);

// 🔸 계약서 저장
app.post("/api/contracts", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "제목과 내용 입력" });
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  try {
    const saved = await Contract.create({ title, content, hash });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "저장 실패", details: err });
  }
});

// 🔸 계약서 목록
app.get("/api/contracts", async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: "조회 실패", details: err });
  }
});

// 🔸 계약서 상세
app.get("/api/contracts/:id", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "계약서 없음" });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: "상세 조회 실패", details: err });
  }
});

// 🔸 계약서 서명
app.patch("/api/contracts/:id/sign", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "계약서 없음" });

    contract.signed = true;
    contract.signer = req.body.signer || "익명 사용자";
    contract.signatureData = req.body.signatureData || "";

    await contract.save();

    res.json({ message: "서명 완료", contract });
  } catch (err) {
    res.status(500).json({ error: "서명 실패", details: err });
  }
});

// 🔸 서명 저장
app.post("/api/signatures", async (req, res) => {
  const { image, hash } = req.body;
  try {
    const saved = await Signature.create({ image, hash });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "저장 실패", details: err });
  }
});

// 🔸 서명 목록
app.get("/api/signatures", async (req, res) => {
  try {
    const signatures = await Signature.find().sort({ createdAt: -1 });
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ error: "조회 실패", details: err });
  }
});

// 🔸 서명 삭제
app.delete("/api/signatures/:id", async (req, res) => {
  try {
    const result = await Signature.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "서명 없음" });
    res.status(200).json({ message: "삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: "삭제 실패", details: err });
  }
});

app.listen(3001, () => {
  console.log("✅ 서버 실행 중: http://localhost:3001");
});
