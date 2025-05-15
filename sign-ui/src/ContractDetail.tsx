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
  filePath?: string;
}

const ContractDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [signerName, setSignerName] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [status, setStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/contracts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("계약서를 찾을 수 없습니다.");
        return res.json();
      })
      .then((data) => {
        if (data.signed) {
          setAuthRequired(true);
          const name = prompt("서명된 계약서입니다. 열람을 위해 본인 이름을 입력하세요:");
          if (
            name &&
            (name.trim().toLowerCase() === data.creator?.trim().toLowerCase() ||
              name.trim().toLowerCase() === data.signer?.trim().toLowerCase())
          ) {
            setAuthorized(true);
            setSignerName(name);
          } else {
            setError("접근 권한이 없습니다. 열람할 수 없습니다.");
          }
        } else {
          setAuthorized(true);
        }
        setContract(data);
        setEditTitle(data.title);
        setEditContent(data.content);
      })
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

  const handleClearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleDelete = async () => {
    if (!contract) return;
    const encodedName = encodeURIComponent(signerName.trim());

    try {
      const res = await fetch(`http://localhost:3001/api/contracts/${contract._id}?name=${encodedName}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");
      alert("✅ 계약서 삭제 완료");
      navigate("/contracts");
    } catch {
      alert("❌ 삭제 실패: 생성자 이름이 정확히 일치해야 합니다.");
    }
  };

  const handleUpdate = async () => {
    if (!contract) return;

    try {
      const res = await fetch(`http://localhost:3001/api/contracts/${contract._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (!res.ok) throw new Error("수정 실패");
      const updated = await res.json();
      setContract(updated.contract);
      setIsEditing(false);
      alert("✅ 계약서 수정 완료");
    } catch {
      alert("❌ 수정 중 오류 발생");
    }
  };

  const canDelete =
    signerName.trim().toLowerCase() &&
    contract?.creator?.trim().toLowerCase() === signerName.trim().toLowerCase();

  if (error) return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  if (!contract || (authRequired && !authorized)) return <p style={{ padding: "30px" }}>불러오는 중...</p>;

  const fileUrl =
    contract.filePath?.includes("uploads")
      ? `http://localhost:3001/${contract.filePath.replace(/\\/g, "/")}`
      : `http://localhost:3001/uploads/${contract.filePath?.replace(/\\/g, "/")}`;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{contract.title}</h2>
      <p><strong>작성일:</strong> {new Date(contract.createdAt).toLocaleString()}</p>
      <p><strong>서명 여부:</strong> {contract.signed ? "✅ 완료" : "❌ 미완료"}</p>
      <p><strong>서명자:</strong> {contract.signer || "없음"}</p>

      {!contract.signed && !isEditing && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#757575",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ✏️ 수정하기
          </button>
        </div>
      )}

      {!contract.signed && isEditing && (
        <div>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={8}
            style={{ width: "100%", padding: "8px" }}
          />
          <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={handleUpdate}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              💾 저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#757575",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ❌ 취소
            </button>
          </div>
        </div>
      )}

      <hr />
      {contract.filePath ? (
        <div>
          <h3>📄 첨부된 PDF 미리보기</h3>
          <iframe
            src={fileUrl}
            width="100%"
            height="600px"
            title="계약서 PDF"
            style={{ border: "1px solid #ccc" }}
          />
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <a href={fileUrl} download style={{ backgroundColor: "#388e3c", color: "#fff", padding: "8px 16px", textDecoration: "none", borderRadius: "5px" }}>
              ⬇️ PDF 다운로드
            </a>
          </div>
        </div>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f8f8f8", padding: "10px" }}>{contract.content}</pre>
      )}
      <hr />
      <p><strong>해시값:</strong><br />{contract.hash}</p>

      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <input
          type="text"
          placeholder="본인 이름 입력 (생성자만 삭제 가능)"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>

      {!contract.signed && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleStartSign}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1565c0",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
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
          <div style={{ display: "flex", gap: "12px", marginTop: "10px", justifyContent: "center" }}>
            <button
              onClick={handleClearSignature}
              style={{
                padding: "10px 20px",
                backgroundColor: "#9e9e9e",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🗑️ 지우기
            </button>
            <button
              onClick={handleSubmitSignature}
              style={{
                padding: "10px 20px",
                backgroundColor: "#66bb6a",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              서명 제출
            </button>
          </div>
        </div>
      )}

      {canDelete && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#d32f2f",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🗑️ 계약서 삭제
          </button>
        </div>
      )}

      {status && <p style={{ marginTop: "10px", textAlign: "center" }}>{status}</p>}

      <h3 style={{ marginTop: "30px", textAlign: "center" }}>QR 코드로 공유</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QRCodeSVG value={`http://localhost:3000/contracts/${contract._id}`} size={180} level="H" />
      </div>
    </div>
  );
};

export default ContractDetail;
