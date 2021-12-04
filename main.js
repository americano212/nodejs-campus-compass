const http = require('http'); // 서버와 클라이언트 사이 하이퍼텍스트를 빠르게 교환하기 위한 프로토콜
const ejs = require('ejs'); // EJS(Embedded JavaScrip) - 간단히 말해 자바스크립트 내장 HTML임
const express = require('express'); // nodejs를 위한 웹 프레임워크로 더 간결하게 nodejs로 웹을 만들수 있음..
const app = express();
const port = 4000; // 서버에서 몇번 포트로 웹을 호스팅할지
const path = require('path'); // 경로 관련
const sanitize = require('sanitize')
var mysql = require('mysql');
const url = require('url');
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
});

app.get('/newqna', (req, res) => {
    const sql_new_qna = "SELECT q_id,q_question,q_date,q_hit,q_ans_cnt FROM tb_qna WHERE q_ans_cnt=0";
    sb.query(sql_new_qna,function(err,result,fields){
        if(err) throw err;
        res.render('newqna',{content_new_qna : result});
    });
});

app.get('/qna', (req, res) => {
    const sql_qna = "SELECT q_id,q_question,q_date,q_hit,q_ans_cnt FROM tb_qna WHERE NOT q_ans_cnt=0";
    sb.query(sql_qna,function(err,result,fields){
        if(err) throw err;
        res.render('qna',{content_qna : result});
    });
});

app.get('/faq', (req, res) => {
    const sql_faq = "SELECT f_id,f_question,f_date,f_hit FROM tb_faq LIMIT 3";
    sb.query(sql_faq,function(err,result,fields){
        if(err) throw err;
        res.render('faq',{content_faq : result});
    });
});

app.get('/help', (req, res) => {
    res.render('help');
});

app.get('/write', (req, res) => {
    res.render('write');
});

app.post('/write', (req, res) => {
    const post = req.body;
    const desc = post.content;
    const descript = Buffer.from(desc, "utf8").toString('base64');
    const sql = 'INSERT INTO tb_qna (q_question, q_content) VALUES';
    const sqlValue = `("${post.title}","${descript}");`;
    sb.query(sql+sqlValue,req.body,function(err,result,fields){
        if(err) throw err;
        res.redirect('/newqna');
    });
});

app.get('/qna-detail/:id', (req, res) => {
    const sql = "SELECT * FROM tb_qna WHERE q_id = ?";
    const sql_reply = "SELECT * FROM tb_ans WHERE a_q_id = ?";
    const sql_hitup = "UPDATE tb_qna SET q_hit = q_hit + 1 WHERE q_id = ?";
    sb.query(sql,[req.params.id],function(err,result,fields){
        sb.query(sql_reply,[req.params.id],function(err,result_reply,fields){
            if(err){
                throw err;
            }
            sb.query(sql_hitup,[req.params.id],function(err,result_hit,fields){});
            res.render('qna-detail',{contents : result[0],  replys : result_reply, self_seq : req.params.id});
        });
    });
});

app.post('/qna-detail/:id', (req, res) => {
    const reply = req.body.reply;
    var id = req.params.id;
    const sql = 'INSERT INTO tb_ans (a_answer, a_q_id) VALUES';
    const sqlValue = `("${reply}","${id}");`;
    sb.query(sql+sqlValue,function(err,result,fields){
        if(err){
            throw err;
        }
        res.redirect(`/qna-detail/${id}`);
    });
});

app.get('/faq-detail/:id', (req, res) => {
    const sql = "SELECT * FROM tb_faq WHERE f_id = ?";
    const sql_hitup = "UPDATE tb_faq SET f_hit = f_hit + 1 WHERE f_id = ?";
    sb.query(sql,[req.params.id],function(err,result,fields){
        if(err){
            throw err;
        }

        sb.query(sql_hitup,[req.params.id],function(err,result_hit,fields){});
        res.render('faq-detail',{contents : result[0], self_seq : req.params.id, description : result[0]?.f_answer});

    });
});

app.get('/search', (req, res) => {
    var query = url.parse(req.url, true).query.query;
    const sql_call_num = "SELECT c_id,c_keyword,c_num,c_where FROM tb_call WHERE c_keyword LIKE ?";
    const sql_qna = "SELECT q_id,q_question,q_date,q_hit,q_ans_cnt FROM tb_qna WHERE NOT q_ans_cnt=0 AND (q_question LIKE ? OR q_content LIKE ?)";
    const sql_faq = "SELECT f_id,f_question,f_date,f_hit FROM tb_faq WHERE (f_question LIKE ? OR f_answer LIKE ?)";

    sb.query(sql_call_num,['%' + query + '%'],function(err,result1,fields){
        if(err) throw err;

        sb.query(sql_qna,['%' + query + '%','%' + query + '%'],function(err,result2,fields){
            if(err) throw err;

            sb.query(sql_faq,['%' + query + '%','%' + query + '%'],function(err,result3,fields){
                if(err) throw err;

                res.render('search',{content_call_num : result1, content_qna:result2, content_faq:result3});
            });
        });
    });
});


// 오류 핸들러
app.use(function(req, res, next) {
    res.status(404)
});

// 호스팅 시작 terminal에서 node main.js로 실행
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
