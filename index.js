//use path module
const path = require('path');
//use express module
const express = require('express');
const session = require('express-session')
//use ejs view engine
const ejs = require('ejs')

//use bodyParser middleware
const bodyParser = require('body-parser')

const router = express.Router();
//use mysql database
const mysql = require('mysql');
const app = express();


app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));



//Create Connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud_db'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage

var sess; // global session, NOT recommended

app.get('/',(req,res) => {
    res.render('index');
});


app.get('/about',(req,res) => {
  res.render('about');
});


/*router.post('/login',(req,res) => {
  sess = req.session;
  sess.email = req.body.email;
  res.end('done');
});*/

app.post('/login',(req, res) => 
{
  let sql = "SELECT * FROM admin_login where  email ='"+req.body.email+"' AND password='"+req.body.pass+"' ";
  let query = conn.query(sql, (err, results) =>
  {
    if (results[0].admin_id > 0) 
    {
      sess = req.session;
      sess.admin_id = results[0].admin_id;
      sess.email = req.body.email;
      res.end('done');
    }
    
  });
});


app.get('/admin',(req,res) => {
  sess = req.session;
  if(sess.email) {
      var val = sess.email;
      res.render('dashboard',{ admin:val });
  }
  else {
    res.render('adminlogin');
  }
});

app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });

});


app.get('/quiz_view',(req, res) => {
  sess = req.session;
  if(sess.admin_id)
  {
  let sql = "SELECT * FROM quiz";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('quiz_view',{
      results: results
    });
  });
  }
  else
  {
    res.redirect('/');
  }

});

//route for insert data
app.post('/save',(req, res) => {
  let data = {question: req.body.question,a1: req.body.a1,a2: req.body.a2,a3: req.body.a3,a4: req.body.a4,answer: req.body.answer};
  let sql = "INSERT INTO quiz SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/quiz_view');
  });
});

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE quiz SET question ='"+req.body.question+"', a1='"+req.body.a1+"', a2='"+req.body.a2+"', a3='"+req.body.a3+"', a4='"+req.body.a4+"', answer='"+req.body.answer+"' WHERE quiz_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/quiz_view');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM quiz WHERE quiz_id="+req.body.quiz_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/quiz_view');
  });
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
