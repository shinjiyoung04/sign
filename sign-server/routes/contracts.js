const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");
const crypto = require("crypto");

// 계약서 생성
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const hash = crypto.createHash("sha256").update(content).digest("hex");
    const newContract = await Contract.create({ title, content, hash });
    res.json(newContract);
  } catch (err) {
    res.status(500).json({ error: "계약서 저장 실패" });
  }
});

// 계약서 목록 조회
router.get("/", async (req, res) => {
  const list = await Contract.find().sort({ createdAt: -1 });
  res.json(list);
});

// 계약서 단일 조회
router.get("/:id", async (req, res) => {
  const contract = await Contract.findById(req.params.id);
  if (!contract) return res.status(404).json({ error: "계약서 없음" });
  res.json(contract);
});

// 계약서 서명
router.patch("/:id/sign", async (req, res) => {
  const { signer, signatureData } = req.body;
  const contract = await Contract.findById(req.params.id);
  if (!contract) return res.status(404).json({ error: "계약서 없음" });

  contract.signed = true;
  contract.signer = signer;
  contract.signatureData = signatureData;
  await contract.save();

  res.json({ message: "서명 완료", contract });
});

// 계약서 삭제
router.delete("/:id", async (req, res) => {
  const result = await Contract.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: "삭제 실패" });
  res.json({ message: "삭제 완료" });
});

module.exports = router;
