var express = require('express')
var app = express()
var session = require('express-session')

app.get('/',function(req,res){
	sess = req.session;
	if(sess.email) {
		var val = sess.email;
		res.render('index',{ admin:val });
	}
	else {
	  res.render('login');
	}
});

app.get('/login',function(req,res){
	sess = req.session;
	if(sess.email) {
		var val = sess.email;
		res.redirect('index',{ admin:val });
	}
	else {
	  res.render('login');
	}
});
app.get('/admin',function(req,res){
	sess = req.session;
	if(sess.email) {
		var val = sess.email;
		res.redirect('index',{ admin:val });
	}
	else {
	  res.redirect('/login');
	}
});
app.post('/admin', function(req, res, next) {
	var user = [ req.sanitize('email').escape().trim(), req.sanitize('pass').escape().trim() ]
	req.getConnection(function(error, conn) {
		conn.query("SELECT * FROM admin_login where email =? AND password=? ", user ,function(err, rows , fields) {
			if(err) throw err
			if (rows.length <= 0) {
				req.flash('error', 'Invalid Username And Password')
				res.redirect('/login')
			}
			else
			{
				sess = req.session;
				sess.admin_id = rows[0].admin_id;
				sess.name = rows[0].name;
      			sess.email = req.body.email;
				res.render('index')
			}
		})
	})
})
app.get('/logout',function(req,res,next) {
	req.session.destroy((err)=>{
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
	});
});
  
/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;
