import React, { useState } from "react";

const CreateContract: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creator, setCreator] = useState("");
  const [type, setType] = useState("집 계약서");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const getPlaceholder = (type: string) => {
    switch (type) {
      case "집 계약서":
        return "예시: 임대인과 임차인의 정보, 주소, 임대 기간, 보증금 및 월세 금액 등 입력";
      case "등록금 계약서":
        return "예시: 학생 이름, 학번, 등록금 금액, 납부 일정, 환불 조건 등 입력";
      case "근로 계약서":
        return "예시: 근로자와 고용주의 정보, 근무 시간, 급여, 계약 기간 등 입력";
        case "PDF":
        return "PDF 파일은 수정이 불가능합니다. 파일 생성자에게 문의하세요.";
      case "기타":
      default:
        return "계약서 내용을 입력하세요";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !creator || !type) {
      alert("제목, 생성자, 타입은 필수입니다.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("creator", creator);
    formData.append("type", type);
    formData.append("content", content); // 선택 사항
    if (pdfFile) {
      formData.append("file", pdfFile);
    }

    try {
      const res = await fetch("http://localhost:3001/api/contracts/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("저장 실패");

      setStatus("✅ 계약서가 성공적으로 저장되었습니다.");
      setTitle("");
      setContent("");
      setCreator("");
      setType("집 계약서");
      setPdfFile(null);
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
          placeholder="제목 입력 (필수)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          required
        />
        <textarea
          placeholder={getPlaceholder(type)}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="계약 생성자 이름 (필수)"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        >
          <option value="집 계약서">집 계약서</option>
          <option value="등록금 계약서">등록금 계약서</option>
          <option value="근로 계약서">근로 계약서</option>
          <option value="PDF">PDF</option>
          <option value="기타">기타</option>
        </select>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#004DC9",
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
