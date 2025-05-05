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
                style={{ width: "300px", border: "1px solid #ddd", marginBottom: "10px" }}
              />
              <div style={{ wordBreak: "break-all", fontSize: "12px" }}>
                <strong>해시값:</strong> {sig.hash}
              </div>
              <div style={{ color: "#777", fontSize: "12px" }}>
                <strong>작성일:</strong> {new Date(sig.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignatureList;
