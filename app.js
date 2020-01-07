var express = require('express')
var app = express()

var mysql = require('mysql')

/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))
app.use('/assets',express.static(__dirname + '/public'));
/**
 * setting up the templating view engine
 */ 
app.set('view engine', 'ejs')

/**
 * import routes/index.js
 * import routes/users.js
 */ 
var index = require('./routes/index')
var users = require('./routes/users')
var quiz = require('./routes/quiz')


/**
 * Express Validator Middleware for Form Validation
 */ 
var expressValidator = require('express-validator')
app.use(expressValidator())


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


/**
 * This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */ 
var methodOverride = require('method-override')

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */ 
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())

app.get('/test', function(req, res, next) {
	sess = req.session;

	req.getConnection(function(error, conn) {
		// console.log(sess.question_data);
		if(sess.question_data == '' ){
			var question_data = {};
			sess.question_data = question_data;
 		} 
		conn.query('SELECT * FROM queans ORDER BY qa_id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('test', {
					title: 'All Questions', 
					data: ''
				})
			} else {
 				res.render('test', {
					title: 'All Questions', 
					data: rows
				})
			}
		})
	})
})
// ADD NEW question POST ACTION
app.post('/setQuestionSession', function(req, res, next){	
   // console.log(req.body);
   // console.log(JSON.stringify(req.body.correct_ans) );

    sess = req.session;
    var question_data = {
    				quesId : req.body.qid,
    				quesCount : req.body.qcount, 
    				correct_ans : req.body.correct_ans, 
    				timer_time : req.body.timer_time 
    			}
    sess.question_data = question_data;
    var response = 
    	{
    		'status':'1',
    		'massage': 'success',
    		'quesId': req.body.qid
   		};
    res.send(response);
    res.end(); 
})

app.post('/setCurrentQuestionTime', function(req, res, next){

	sess = req.session;
	var quesId = req.body.qid;
	var quesCount = req.body.qcount;
 	var timer_time = req.body.timer_time;
   	if(sess.usetime){
    	var questionSession = sess.usetime;
    	if(questionSession.quesId == quesId){
    		sess.usetime.timer_time = timer_time;
    	}else{
     		var usetime = {
				quesId : req.body.qid,
				quesCount : req.body.qcount, 
	 			timer_time : req.body.timer_time 
 			} 
 			sess.usetime = usetime;
    	}
    }else{
    	var usetime = {
			quesId : req.body.qid,
			quesCount : req.body.qcount, 
 			timer_time : req.body.timer_time 
		}
       sess.usetime = usetime;
    } 
    var response = 
    	{
    		'status':'1',
    		'massage': 'success',
    		'quesId': req.body.qid
   		};
    res.send(response);
    res.end(); 
})

app.post('/submit_qty', function(req, res, next){ 

	sess = req.session;
	
	req.getConnection(function(error, conn) {

	    var user_correct_ans = JSON.stringify(req.body.user_correct_ans);
	    // console.log(user_correct_ans);
	    var right_ans_count = 0;
	    var attemp_quesCount = 0;
	    var answer_id  = 0;
	    if(user_correct_ans != ''){
	    	var jsonString = JSON.parse(user_correct_ans);
	    	// console.log(jsonString);
	    	var i =1;
	    	var checkResult = 0;
	    	
		    for(index in jsonString){

	 			var question_str =  jsonString[index];
	  			question_arr = question_str.split("_");
	  			var question_id = question_arr[0];

	  			if(question_arr[1] != ''){
	  				attemp_quesCount++;
	  			} 
	  			var question_ans = question_arr[1];
	  			
	 			// console.log(question_id + question_ans);
	  			
				conn.query('SELECT qa_id FROM queans WHERE qa_id = '+question_id+' AND answer = "'+question_ans+'" ', function(err, result, fields) {
						console.log(result.length);
						if(err) throw err

						if (result.length > 0) { 
							right_ans_count += 1;
					    }
					    if(i == jsonString.length){
				      		console.log('right_ans_count='+right_ans_count);
				      		
				      	var anser_obj = {
							correct_ans: right_ans_count,
							total_answer: jsonString.length,
							attempt_ques: attemp_quesCount
				  		} 
							conn.query('INSERT INTO users_result SET ?', anser_obj, function(err, rows) {
			 				if (!err) {
 			 					answer_id  = rows.insertId;
 			 					console.log('inser answer'+rows.insertId);
 							    var question_data = null; 
							    sess.question_data = question_data; 
							    sess.usetime = question_data; 
							    var response = {
							    		'status':'1',
							    		'massage': 'success',
							    		'answer_id': answer_id
							    };
							    res.send(response);
							    res.end();

							}else{ 
 							    var response = {
							    		'status':'0',
							    		'massage': 'error',
							    		'answer_id': 0
							    };
							    res.send(response);
							    res.end();
							}
			 			});  
						} 
					i++;			
				})  
	      	} 
	    }else{
	    	var response = {
			    		'status':'0',
			    		'massage': 'error',
			    		'answer_id': 0
			    };
			    res.send(response);
			    res.end();

	    } 
   	})  
})
app.get('/question_result/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users_result WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Result not found with id = ' + req.params.id)
				res.render('question_result', {
					title: 'Question Result',
					data_result :  '' 
  				})
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('question_result', {
					title: 'Question Result',
					data_result :  rows[0] 
 				})
			}			
		})
	})
})

app.use('/', index)
app.use('/users', users)
app.use('/quiz', quiz)

app.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
})
