const http = require('http'); // 서버와 클라이언트 사이 하이퍼텍스트를 빠르게 교환하기 위한 프로토콜
const ejs = require('ejs'); // EJS(Embedded JavaScrip) - 간단히 말해 자바스크립트 내장 HTML임
const express = require('express'); // nodejs를 위한 웹 프레임워크로 더 간결하게 nodejs로 웹을 만들수 있음..
const app = express();
const port = 4000; // 서버에서 몇번 포트로 웹을 호스팅할지
const path = require('path'); // 경로 관련

var mysql = require('mysql');

var db_config  = require('./config/db-config.json');
// database
const sb = mysql.createConnection({
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database,
    dateStrings : 'date'
});

sb.connect(function(err){
    if (err) throw err;
    console.log('Connected DBDB');

});

const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(express.static(__dirname+'/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// domain으로 들어왔을때 어떤걸 render 해줄지
app.get('/', (req, res) => { // req : request, res : response
    const sql_new_qna = "SELECT q_id,q_question,q_date,q_hit,q_ans_cnt FROM tb_qna WHERE q_ans_cnt=0 LIMIT 3";
    const sql_qna = "SELECT q_id,q_question,q_date,q_hit,q_ans_cnt FROM tb_qna WHERE NOT q_ans_cnt=0 LIMIT 3";
    const sql_faq = "SELECT f_id,f_question,f_date,f_hit FROM tb_faq LIMIT 3";

    sb.query(sql_new_qna,function(err,result1,fields){
        if(err) throw err;

        sb.query(sql_qna,function(err,result2,fields){
            if(err) throw err;

            sb.query(sql_faq,function(err,result3,fields){
                if(err) throw err;

                res.render('index',{content_new_qna : result1, content_qna:result2, content_faq:result3});
            });
        });
    });
})



// 오류 핸들러
app.use(function(req, res, next) {
    res.status(404)
});

// 호스팅 시작 terminal에서 node main.js로 실행
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
