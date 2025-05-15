const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ uploads 폴더 생성 및 정적 파일 서빙 설정
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ✅ MongoDB 연결
mongoose.connect(
  "mongodb+srv://shinspace04:OkBpxI4haoTAenM7@cluster.k4no5nf.mongodb.net/signatures?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB 연결 성공!");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB 연결 실패:", err);
});

// ✅ 계약서 스키마
const ContractSchema = new mongoose.Schema({
  title: String,
  content: String,
  creator: String,
  type: String,
  hash: String,
  createdAt: { type: Date, default: Date.now },
  signed: { type: Boolean, default: false },
  signer: { type: String, default: "" },
  signatureData: { type: String, default: "" },
  filePath: { type: String, default: "" },
});
const Contract = mongoose.model("Contract", ContractSchema);

// ✅ 서명 스키마
const SignatureSchema = new mongoose.Schema({
  image: String,
  hash: String,
  createdAt: { type: Date, default: Date.now },
});
const Signature = mongoose.model("Signature", SignatureSchema);

// ✅ 계약서 생성 (텍스트 전용)
app.post("/api/contracts", async (req, res) => {
  const { title, content, creator, type } = req.body;
  if (!title || !content || !creator || !type) {
    return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
  }
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  try {
    const contract = await Contract.create({ title, content, creator, type, hash });
    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ error: "저장 실패", details: err });
  }
});

// ✅ 계약서 + PDF 업로드용 생성
app.post("/api/contracts/upload", upload.single("file"), async (req, res) => {
  const { title, content, creator, type } = req.body;
  const file = req.file;
  if (!title || !creator || !type) {
    return res.status(400).json({ error: "필수 항목 누락" });
  }
  const hash = crypto.createHash("sha256").update(content || "").digest("hex");
  try {
    const contract = await Contract.create({
      title,
      content: content || "",
      creator,
      type,
      hash,
      filePath: file?.path || "",
    });
    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ error: "PDF 계약 저장 실패", details: err });
  }
});

// ✅ 계약서 목록
app.get("/api/contracts", async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: "조회 실패", details: err });
  }
});

// ✅ 계약서 상세
app.get("/api/contracts/:id", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "계약서 없음" });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: "상세 조회 실패", details: err });
  }
});

// ✅ 계약서 수정
app.patch("/api/contracts/:id", async (req, res) => {
  try {
    const updated = await Contract.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ message: "수정 완료", contract: updated });
  } catch (err) {
    res.status(500).json({ error: "수정 실패", details: err });
  }
});

// ✅ 계약서 서명
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

// ✅ 계약서 삭제 (생성자 본인만)
app.delete("/api/contracts/:id", async (req, res) => {
  const { id } = req.params;
  const name = req.query.name;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "삭제하려면 이름(name)이 필요합니다." });
  }
  try {
    const contract = await Contract.findById(id);
    if (!contract) return res.status(404).json({ error: "계약서를 찾을 수 없습니다." });
    const inputName = name.trim().toLowerCase();
    const creatorName = (contract.creator || "").trim().toLowerCase();
    if (inputName !== creatorName) {
      return res.status(403).json({ error: "계약서 생성자만 삭제할 수 있습니다." });
    }
    await Contract.findByIdAndDelete(id);
    res.status(200).json({ message: "계약서 삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: "삭제 중 서버 오류", details: err });
  }
});

// ✅ 서명 저장
app.post("/api/signatures", async (req, res) => {
  const { image, hash } = req.body;
  try {
    const saved = await Signature.create({ image, hash });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "서명 저장 실패", details: err });
  }
});

// ✅ 서명 목록
app.get("/api/signatures", async (req, res) => {
  try {
    const signatures = await Signature.find().sort({ createdAt: -1 });
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ error: "서명 조회 실패", details: err });
  }
});

// ✅ 서명 삭제
app.delete("/api/signatures/:id", async (req, res) => {
  try {
    const result = await Signature.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "서명 없음" });
    res.status(200).json({ message: "서명 삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: "서명 삭제 실패", details: err });
  }
});

// ✅ 서버 시작
app.listen(3001, () => {
  console.log("✅ 서버 실행 중: http://localhost:3001");
});
