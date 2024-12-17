# 🧭 campus-compass(캠퍼스 콤파스) Repository

🌐 서비스 주소: http://campuscompass.dongjun.me:4000

💾 서비스 소개 자료(ppt): [Google Drive](https://drive.google.com/file/d/1zOF0pBFKvnUx6k_5gfX2Z-iuy7ruDpcc/view?usp=sharing)

2021 Sogang Univ. Artech Hackathon 1st prize 🥇

## 💻 프로젝트 소개
'캠퍼스-콤파스'는 학사행정의 문제 해결 방법을 공유할 수 있는 서비스입니다. 산발적이고 중복되는 정보들을 모아줌으로써 교내 구성원들의 학사행정의 피로도를 낮출 수 있습니다.

## 🔧 주요기능
1. 재학생의 문제/재학생의 해결법 공유 문답 기능

2. 자주 등장하는 질문에 공식적 링크/규정/연락처 제공 기능

3. 세부적인 문제와 실질적인 해결사례 저장 DB 제공 및 검색 기능

## 🔨 Dev Guide
### ⚙ Dev Environment
- `Express.js: 4.17.1`
- **Database**: `MySQL` Community(v8.x)
- **Infra Structure**: `Ubuntu 20.04`

### Init Project
1. Install [Node JS](https://nodejs.org/).
2. Install npm dependencies `npm ci`
3. Create `.env` file with DB config file `./config/db-config.json`
4. Starts the project on preview server. `node main.js`
5. Starts the project on preview server(continuous) `pm2 start main.js`
6. Stop the project on preview server. `pm2 stop main`

## 📷 주요화면
### PC
<p align="center"><img src="https://github.com/user-attachments/assets/2b7fd8b9-86f5-447f-b686-1995e192ede4" /></p>

### Mobile
<p align="center"><img src="https://github.com/user-attachments/assets/295e6632-5129-4601-8272-ceb35560a4a5" width="450" /></p>
