import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateContract: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("저장 실패");

      const data = await res.json();
      setStatus("✅ 계약서가 성공적으로 저장되었습니다.");
      setTitle("");
      setContent("");

      // 저장 후 상세 페이지로 이동
      navigate(`/contracts/${data._id}`);
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
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            fontSize: "16px",
          }}
        />
        <textarea
          placeholder="계약서 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "16px",
            marginBottom: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          저장
        </button>
      </form>
      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
};

export default CreateContract;
