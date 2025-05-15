import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

const VerifyQR: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const url = new URL(decodedText);
          if (url.pathname.startsWith("/contracts/")) {
            await scanner.clear(); // 🔐 중복 상태 전환 방지
            navigate(url.pathname);
          } else {
            alert("유효하지 않은 계약서 링크입니다.");
          }
        } catch {
          alert("QR 코드 해석 실패");
        }
      },
      (errorMessage) => {
        console.warn("QR 스캔 실패:", errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [navigate]);

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>📷 QR 코드 스캔 후 계약서 찾기</h2>
      <div id="qr-reader" style={{ width: "300px", margin: "0 auto" }} />
    </div>
  );
};

export default VerifyQR;
