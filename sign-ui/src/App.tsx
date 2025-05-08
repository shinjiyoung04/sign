import React from "react";
import CreateContract from "./CreateContract";
import ContractList from "./ContractList";
import ContractDetail from "./ContractDetail";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignaturePad from "./SignaturePad";
import SignatureList from "./SignatureList";
import VerifyQR from "./VerifyQR";
import QrHistory from "./QrHistory";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
  <Link to="/" style={{ marginRight: "20px" }}>✍️ 서명하기</Link>
  <Link to="/create-contract" style={{ marginRight: "20px" }}>📝 계약 생성</Link>
  <Link to="/contracts" style={{ marginRight: "20px" }}>📄 계약 목록</Link>
  <Link to="/verify-qr">🔍 QR 스캔</Link>
</nav>


        <Routes>
          <Route path="/" element={<SignaturePad />} />
          <Route path="/list" element={<SignatureList />} />
          <Route path="/create-contract" element={<CreateContract />} />
          <Route path="/contracts" element={<ContractList />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/verify-qr" element={<VerifyQR />} />
          <Route path="/qr-history" element={<QrHistory />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
