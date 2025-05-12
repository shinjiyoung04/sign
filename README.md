# 📄 전자계약 시스템

QR 코드 기반으로 계약서를 생성하고, 전자서명 및 이메일 발송까지 자동화한 웹 서비스입니다.

---

## ✅ 주요 기능

- 계약서 생성: 제목, 내용, 작성자, 이메일, 유형 입력
- QR 코드 자동 생성: 계약서 ID로 QR 코드 생성
- 이메일 전송: QR 코드 포함 계약서 이메일 발송
- 전자서명: 서명 캔버스를 통해 서명 이미지 저장
- 계약서 조회: 계약서 목록 및 상세 확인
- QR 검증: 스캔으로 계약서 진위 확인

---

## ⚙️ 기술 스택

Frontend: React, TypeScript  
Backend: Node.js, Express  
DB: MongoDB  
기타: nodemailer, qrcode, signature-canvas

---

## 🚀 실행
서버 실행
cd server
npm install
npm run dev


클라이언트 실행
cd client
npm install
npm start
