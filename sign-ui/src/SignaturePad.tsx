import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import * as CryptoJS from "crypto-js";

const SignaturePad: React.FC = () => {
  const sigRef = useRef<SignatureCanvas>(null);
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("서명 대기 중");

  const clear = () => {
    sigRef.current?.clear();
    setHash("");
    setStatus("서명 대기 중");
  };

  const save = async () => {
    if (sigRef.current?.isEmpty()) {
      alert("서명을 먼저 해주세요.");
      return;
    }

    const dataURL = sigRef.current?.toDataURL();
    if (!dataURL) {
      alert("서명 데이터를 가져올 수 없습니다.");
      return;
    }

    const hashValue = CryptoJS.SHA256(dataURL).toString();
    setHash(hashValue);
    setStatus("서명 완료됨");

    try {
      const response = await fetch("http://localhost:3001/api/signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataURL, hash: hashValue }),
      });

      if (response.ok) {
        console.log("✅ 서명이 서버에 저장되었습니다.");
      } else {
        console.error("❌ 서버 응답 오류", response.statusText);
      }
    } catch (err) {
      console.error("❌ 서버 연결 실패", err);
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: "14px 32px",
    margin: "0 10px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s",
    backgroundColor: "#4a90e2",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#999",
  };

  return (
    <div style={{ textAlign: "center", padding: "30px", fontFamily: "sans-serif" }}>
      <h2>전자서명 실습</h2>

      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 500,
          height: 200,
          style: {
            border: "2px dashed #888",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "crosshair",
          },
        }}
      />
      <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
        이 박스 안에 서명해주세요.
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={save} style={buttonStyle}>서명 저장</button>
        <button onClick={clear} style={secondaryButtonStyle}>지우기</button>
      </div>

      <div style={{ marginTop: "30px", color: "#333" }}>
        <strong>상태:</strong> {status}
        <br />
        <strong>해시값:</strong>
        <div
          style={{
            wordBreak: "break-all",
            maxWidth: "80%",
            margin: "10px auto",
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#444",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {hash}
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
