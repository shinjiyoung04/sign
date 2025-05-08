import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Contract = {
  _id: string;
  title: string;
  createdAt: string;
  signed: boolean;
  signer?: string;
};

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/contracts")
      .then((res) => res.json())
      .then((data) => setContracts(data))
      .catch(() => alert("계약서 목록을 불러오지 못했습니다."));
  }, []);

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
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3>{contract.title}</h3>
              <p>
                🗓️ 작성일: {new Date(contract.createdAt).toLocaleString()}
              </p>
              <p>
                {contract.signed ? (
                  <span style={{ color: "green" }}>✅ 서명 완료</span>
                ) : (
                  <span style={{ color: "red" }}>❌ 서명 미완료</span>
                )}
              </p>
              <p>✍️ 서명자: {contract.signer || "없음"}</p>
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
