import React, { useEffect, useState } from "react";

type Signature = {
  _id: string;
  image: string;
  hash: string;
  createdAt: string;
};

const SignatureList: React.FC = () => {
  const [signatures, setSignatures] = useState<Signature[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3001/api/signatures");
      const data = await res.json();
      setSignatures(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("정말로 이 서명을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/signatures/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ 삭제 실패:", errorData);
        alert("삭제 실패: " + errorData.error);
        return;
      }

      setSignatures(signatures.filter(sig => sig._id !== id));
    } catch (err) {
      console.error("❌ 서버 연결 실패:", err);
      alert("서버 오류로 삭제하지 못했습니다.");
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>🗂️ 서명 기록 보기</h2>
      {signatures.length === 0 ? (
        <p>서명 기록이 없습니다.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {signatures.map((sig) => (
            <div
              key={sig._id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#fafafa",
              }}
            >
              <img
                src={sig.image}
                alt="signature"
                style={{
                  width: "300px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                }}
              />
              <div style={{ wordBreak: "break-all", fontSize: "12px" }}>
                <strong>해시값:</strong> {sig.hash}
              </div>
              <div style={{ color: "#777", fontSize: "12px" }}>
                <strong>작성일:</strong>{" "}
                {new Date(sig.createdAt).toLocaleString()}
              </div>
              <button
                onClick={() => handleDelete(sig._id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignatureList;
