1. 프론트엔드: sign-ui (React + TypeScript)
주요 기술 스택으로는 React (CRA with TypeScript), React Router DOM (페이지 이동), react-signature-canvas (서명 입력), crypto-js(해시 생성)

설치한 패키지
npm install react-signature-canvas crypto-js react-router-dom
npm install --save-dev @types/react-router-dom

2. 백엔드: sign-server (node.js + Express + Mongodb)
   Node.js
   Express
   Mongoose (mongoDB ODM)
   MongoDB Atlas (클라우드 DB)
   body-parser
   cors
설치한 패키지
npm install express mongoose body-parser cors

3. 데이터베이스
  mongodb atlas

![스크린샷 2025-05-10 065947](https://github.com/user-attachments/assets/2503e561-675b-4f24-8fe1-896bc9df6f5a)
![스크린샷 2025-05-10 065931](https://github.com/user-attachments/assets/71fbc1f1-5cd1-44bc-b9c4-73089d162ba7)
![스크린샷 2025-05-10 065908](https://github.com/user-attachments/assets/27bee207-2769-4801-a7f9-69f57e58c44d)
![스크린샷 2025-05-10 065846](https://github.com/user-attachments/assets/51fafe77-4a77-4b46-85ca-67567437119d)
![스크린샷 2025-05-10 065839](https://github.com/user-attachments/assets/228c9a79-297c-4ba1-b695-ec143490ba3d)

🔐 전자계약 시스템 개발 프로젝트 (part.F 실습)

프로젝트 개요

프로젝트명: 전자서명 기반 계약서 관리 시스템

진행 기간: 2025년 5월

목표: 계약서 생성, 서명, 검증, 삭제 기능을 포함한 전체 흐름을 웹 UI와 MongoDB 백엔드로 구현하여 보안성과 사용자 편의성을 확보한 실용적 시스템 구축

기술 스택

Frontend: React, TypeScript, react-signature-canvas, qrcode.react

Backend: Express.js, Node.js, MongoDB, Mongoose, Crypto

Deploy/Test: Local 환경 (Windows 10, GitHub 연결)

주요 기능 및 구현 내용

📝 계약서 생성

계약 제목, 내용, 생성자 이름, 계약 유형(집 계약서, 등록금 계약서 등) 입력

계약서 내용에 대해 SHA-256 해시값 생성 후 MongoDB 저장

✍️ 계약서 서명

계약서 목록에서 미서명된 계약서를 선택 후 이름 입력 및 서명 캔버스를 통해 서명

서명 이미지를 toDataURL로 전송 후 MongoDB에 저장

이미 서명된 계약서는 다시 서명 불가 처리 (Validation 수행)

📄 계약서 목록 보기

모든 계약서의 제목, 생성일자, 서명 여부 표시

상세 보기 링크 제공

🔍 상세 보기 및 QR 공유

계약서 내용, 해시값, 서명자 확인 가능

QR 코드로 계약서 상세 URL 생성

생성자와 서명자 이름이 동일한 경우에만 삭제 버튼 노출

🗑️ 계약서 삭제

본인 확인을 위해 이름 입력 필수

MongoDB 내 해당 계약서 삭제

📷 QR 코드 스캔 기능

html5-qrcode 라이브러리를 통해 계약서 QR을 스캔하고 자동으로 상세 페이지 이동

📁 GitHub 관리

sign-ui, sign-server로 프론트/백엔드 분리

GitHub에 private repo로 연동 후 필요 시 public으로 전환

non-fast-forward 오류 발생 시 pull --rebase 및 --force 명령어 사용으로 해결
