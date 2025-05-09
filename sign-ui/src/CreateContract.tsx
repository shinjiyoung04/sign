import React, { useState } from "react";

const CreateContract: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creator, setCreator] = useState("");
  const [type, setType] = useState("집 계약서");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !creator || !type) {
      alert("모든 항목을 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, creator, type })
,
      });

      if (!res.ok) throw new Error("저장 실패");
      setStatus("✅ 계약서가 성공적으로 저장되었습니다.");
      setTitle("");
      setContent("");
      setCreator("");
      setType("집 계약서");
    } catch (err) {
      console.error(err);
      setStatus("❌ 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📝 계약서 작성</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목 입력"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          placeholder="계약서 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="계약 생성자 이름"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="집 계약서">집 계약서</option>
          <option value="등록금 계약서">등록금 계약서</option>
          <option value="근로 계약서">근로 계약서</option>
          <option value="기타">기타</option>
        </select>
        <button
          onClick={handleSubmit}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          계약서 생성
        </button>
      </form>
      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
};

export default CreateContract;
