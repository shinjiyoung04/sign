import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignaturePad from "./SignaturePad";
import SignatureList from "./SignatureList";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "20px" }}>✍️ 서명하기</Link>
          <Link to="/list">📄 서명 기록 보기</Link>
        </nav>
        <Routes>
          <Route path="/" element={<SignaturePad />} />
          <Route path="/list" element={<SignatureList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
