import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Contract = {
  _id: string;
  title: string;
  createdAt: string;
  signed: boolean;
  signer?: string;
  type?: string;
  signatureData?: string;
};

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/contracts")
      .then((res) => res.json())
      .then((data) => setContracts(data))
      .catch(() => alert("계약서 목록을 불러오지 못했습니다."));
  }, []);

  // ✅ 실제 사용하는 타입 기준으로 라벨 색상 정의
  const typeColors: Record<string, string> = {
    "집 계약서": "#FAB1BA",     // 주황
    "등록금 계약서": "#42a5f5", // 파랑
    "근로 계약서": "#66bb6a",   // 초록
    기타: "#9e9e9e",           // 회색
  };

  const TypeLabel = ({ type }: { type?: string }) => {
    const label = (type || "기타").trim();
    const color = typeColors[label] ?? "#607d8b";
    return (
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: color,
          color: "#fff",
          fontSize: "14px",
          fontWeight: "bold",
          padding: "6px 12px",
          borderRadius: "20px",
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📑 계약서 목록</h2>
      {contracts.length === 0 ? (
        <p>계약서가 없습니다.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {contracts.map((contract) => (
            <div
              key={contract._id}
              style={{
                position: "relative",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                paddingTop: "40px",
                backgroundColor: contract.signed ? "#e8f5e9" : "#f9f9f9",
                boxShadow: "2px 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <TypeLabel type={contract.type} />

              <h3>{contract.title}</h3>
              <p>🗓️ 작성일: {new Date(contract.createdAt).toLocaleString()}</p>
              <p>
                {contract.signed ? (
                  <span style={{ color: "green" }}>✅ 서명 완료</span>
                ) : (
                  <span style={{ color: "red" }}>❌ 서명 미완료</span>
                )}
              </p>
              

              {contract.signatureData && (
                <div style={{ marginTop: "10px" }}>
                  <p>🖋️ 서명 이미지:</p>
                  <img
                    src={contract.signatureData}
                    alt="서명"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}

              <Link to={`/contracts/${contract._id}`}>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  상세 보기
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractList;
