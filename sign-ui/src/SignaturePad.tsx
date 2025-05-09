import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

// ✅ 타입 정의 추가
interface Contract {
  _id: string;
  title: string;
  signed: boolean;
}

const SignaturePad: React.FC = () => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [signer, setSigner] = useState("");
  const [status, setStatus] = useState("");

  // 계약서 목록 불러오기
  useEffect(() => {
    fetch("http://localhost:3001/api/contracts")
      .then((res) => res.json())
      .then((data) => setContractList(data))
      .catch(() => alert("계약서 목록 불러오기 실패"));
  }, []);

  const handleClear = () => {
    sigCanvas.current?.clear();
  };

  const handleSubmit = async () => {
    const selected = contractList.find((c) => c._id === selectedContract);
    if (!selectedContract) {
      alert("서명할 계약서를 선택하세요.");
      return;
    }
    if (!signer.trim()) {
      alert("서명자 이름을 입력하세요.");
      return;
    }
    if (!selected) {
      alert("계약서 정보를 찾을 수 없습니다.");
      return;
    }
    if (selected.signed) {
      alert("이미 서명된 계약서입니다.");
      return;
    }
    if (sigCanvas.current?.isEmpty()) {
      alert("서명을 입력하세요.");
      return;
    }

    const dataURL = sigCanvas.current?.getCanvas().toDataURL("image/png");

    try {
      const res = await fetch(`http://localhost:3001/api/contracts/${selectedContract}/sign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signer,
          signatureData: dataURL,
        }),
      });

      if (!res.ok) throw new Error("서명 실패");
      setStatus("✅ 서명 완료");
      sigCanvas.current?.clear();
      setSigner("");
      setSelectedContract("");
    } catch (err) {
      console.error(err);
      setStatus("❌ 서명 실패");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>✍️ 계약서에 서명하기</h2>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={selectedContract}
          onChange={(e) => setSelectedContract(e.target.value)}
          style={{ padding: "8px", width: "100%" }}
        >
          <option value="">📄 서명할 계약서를 선택하세요</option>
          {contractList.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="서명자 이름"
        value={signer}
        onChange={(e) => setSigner(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      <SignatureCanvas
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
        ref={sigCanvas}
        backgroundColor="#f0f0f0"
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleClear} style={{ marginRight: "10px" }}>
          지우기
        </button>
        <button onClick={handleSubmit}>서명 제출</button>
      </div>

      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
};

export default SignaturePad;
