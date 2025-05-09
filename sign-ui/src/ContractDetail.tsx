import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import SignatureCanvas from "react-signature-canvas";

interface Contract {
  _id: string;
  title: string;
  content: string;
  hash: string;
  createdAt: string;
  signed: boolean;
  signer?: string;
  creator?: string;
}

const ContractDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [signerName, setSignerName] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [status, setStatus] = useState("");
  const sigCanvas = useRef<SignatureCanvas>(null);

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
      alert("서명 중 오류 발생");
    }
  };

  const handleDelete = async () => {
    if (!contract) return;
    try {
      const res = await fetch(`http://localhost:3001/api/contracts/${contract._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signerName }),
      });
      if (!res.ok) throw new Error("삭제 실패");
      alert("✅ 계약서 삭제 완료");
      navigate("/contracts");
    } catch {
      alert("❌ 삭제 실패: 이름이 일치하지 않거나 오류 발생");
    }
  };

  if (error) return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  if (!contract) return <p style={{ padding: "30px" }}>불러오는 중...</p>;

  const canDelete = contract.signed && signerName.trim() && (signerName === contract.creator || signerName === contract.signer);

  return (
    <div style={{ padding: "30px" }}>
      <h2>{contract.title}</h2>
      <p><strong>작성일:</strong> {new Date(contract.createdAt).toLocaleString()}</p>
      <p><strong>서명 여부:</strong> {contract.signed ? "✅ 완료" : "❌ 미완료"}</p>
      <p><strong>서명자:</strong> {contract.signer || "없음"}</p>
      <hr />
      <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f8f8f8", padding: "10px" }}>{contract.content}</pre>
      <hr />
      <p><strong>해시값:</strong><br />{contract.hash}</p>

      <input
        type="text"
        placeholder="본인 이름 입력 (생성자 또는 서명자)"
        value={signerName}
        onChange={(e) => setSignerName(e.target.value)}
        style={{ padding: "8px", margin: "20px 0 10px 0", width: "300px" }}
      />

      {!contract.signed && (
        <div style={{ marginTop: "10px" }}>
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

      {canDelete && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleDelete}
            style={{ backgroundColor: "#d32f2f", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            🗑️ 계약서 삭제
          </button>
        </div>
      )}

      {status && <p style={{ marginTop: "10px" }}>{status}</p>}

      <h3 style={{ marginTop: "30px" }}>QR 코드로 공유</h3>
      <QRCodeSVG value={`http://localhost:3000/contracts/${contract._id}`} size={180} level="H" />
    </div>
  );
};

export default ContractDetail;
