const http = require('http'); // 서버와 클라이언트 사이 하이퍼텍스트를 빠르게 교환하기 위한 프로토콜
const ejs = require('ejs'); // EJS(Embedded JavaScrip) - 간단히 말해 자바스크립트 내장 HTML임
const express = require('express'); // nodejs를 위한 웹 프레임워크로 더 간결하게 nodejs로 웹을 만들수 있음..
const app = express();
const port = 4000; // 서버에서 몇번 포트로 웹을 호스팅할지
const path = require('path'); // 경로 관련

const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// domain으로 들어왔을때 어떤걸 render 해줄지
app.get('/', (req, res) => { // req : request, res : response
    res.render('index');

})



// 오류 핸들러
app.use(function(req, res, next) {
    res.status(404)
});

// 호스팅 시작 terminal에서 node main.js로 실행
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
