// 🔹 src/ContractDetail.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import SignatureCanvas from "react-signature-canvas";

type Contract = {
  _id: string;
  title: string;
  content: string;
  hash: string;
  createdAt: string;
  signed: boolean;
  signer?: string;
};

const ContractDetail: React.FC = () => {
  const { id } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [signerName, setSignerName] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [status, setStatus] = useState("");
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/contracts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("계약서를 찾을 수 없습니다.");
        return res.json();
      })
      .then((data) => setContract(data))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleStartSign = () => {
    if (!signerName.trim()) {
      alert("서명자 이름을 입력하세요.");
      return;
    }
    setShowSignature(true);
  };

  const handleSubmitSignature = async () => {
    if (!contract || !sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert("서명을 입력하세요.");
      return;
    }

    const signatureData = sigCanvas.current.getCanvas().toDataURL("image/png");

    try {
      const res = await fetch(`http://localhost:3001/api/contracts/${contract._id}/sign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signer: signerName, signatureData }),
      });

      if (!res.ok) throw new Error("서명 실패");
      const updated = await res.json();
      setContract(updated.contract);
      setStatus("✅ 서명 완료");
    } catch {
      alert("서명 이미지 처리 중 오류가 발생했습니다.");
    }
  };

  if (error) return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  if (!contract) return <p style={{ padding: "30px" }}>불러오는 중...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{contract.title}</h2>
      <p><strong>작성일:</strong> {new Date(contract.createdAt).toLocaleString()}</p>
      <p><strong>서명 여부:</strong> {contract.signed ? "✅ 완료" : "❌ 미완료"}</p>
      <p><strong>서명자:</strong> {contract.signer || "없음"}</p>
      <hr />
      <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f8f8f8", padding: "10px" }}>
        {contract.content}
      </pre>
      <hr />
      <p><strong>해시값:</strong><br />{contract.hash}</p>

      {!contract.signed && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="서명자 이름 입력"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            style={{ padding: "8px", marginRight: "10px", width: "200px" }}
          />
          <button
            onClick={handleStartSign}
            style={{ padding: "10px 20px", backgroundColor: "#1565c0", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            서명 시작
          </button>
        </div>
      )}

      {showSignature && !contract.signed && (
        <div style={{ marginTop: "20px" }}>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
            ref={sigCanvas}
            backgroundColor="#f0f0f0"
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => sigCanvas.current?.clear()} style={{ marginRight: "10px" }}>
              지우기
            </button>
            <button onClick={handleSubmitSignature}>서명 제출</button>
          </div>
        </div>
      )}

      {status && <p style={{ marginTop: "10px" }}>{status}</p>}

      <h3 style={{ marginTop: "30px" }}>QR 코드로 공유</h3>
      <QRCodeSVG
        value={`http://localhost:3000/contracts/${contract._id}`}
        size={180}
        level="H"
      />
    </div>
  );
};

export default ContractDetail;
