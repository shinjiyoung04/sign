import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import CreateContract from "./CreateContract";
import ContractList from "./ContractList";
import ContractDetail from "./ContractDetail";
import SignaturePad from "./SignaturePad";
import SignatureList from "./SignatureList";
import VerifyQR from "./VerifyQR";
import QrHistory from "./QrHistory";
import "./App.css";

function App() {
  const navLinks = [
    { to: "/", label: "✍️ 서명하기" },
    { to: "/create-contract", label: "📝 계약 생성" },
    { to: "/contracts", label: "📄 계약 목록" },
    { to: "/verify-qr", label: "🔍 QR 스캔" },
  ];

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="content">
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
      </div>
    </Router>
  );
}

export default App;
