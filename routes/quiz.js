var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM queans ORDER BY qa_id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('quiz/list', {
					title: 'Test List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('quiz/list', {
					title: 'Test List', 
					data: rows
				})
			}
		})
	})
})
app.post('/checkans', function(req, res, next) {
	req.getConnection(function(error, conn) {
			var right_ans_count = 1;
			var queid = req.body.queid;
			var answer = req.body.answer;
			conn.query('SELECT * FROM queans WHERE qa_id = '+queid+' AND answer = "'+answer+'" ', function(err, result, fields) {
			if(err) throw err
			if(result.length > 0) { 
				var response = { 'right_ans_count': right_ans_count  };
				res.send(response);
				res.end();
			}
		})	
	})
})
// SHOW ADD USER FORM
app.get('/add', function(req, res, next){
	res.render('quiz/add', {
		title: 'Add New Que. Ans.',	
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('question', 'Question is required').notEmpty()

    var errors = req.validationErrors()
    
	if( !errors )
	{   
		//var quenansdata =   [ req.sanitize('question').escape().trim(), req.sanitize('option').escape().trim() ]
		/*var quenansdata = {
			question: req.sanitize('question').escape().trim(),option: req.sanitize('option').escape().trim(),answer: req.sanitize('answer').escape().trim(),
			usetime:req.sanitize('usetime').escape().trim()
		}*/
		var option_array = req.body.option;
		var optionobj = option_array.reduce(function(o, val) { o[val] = val; return o; }, {});
		var optiondata = JSON.stringify(optionobj);
		req.getConnection(function(error, conn) {
			conn.query("INSERT INTO queans SET question='"+ req.body.question +"',option='"+ optiondata +"',answer='"+ req.body.answer +"',usetime='"+ req.body.usetime +"'", function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					// render to views/user/add.ejs
					res.render('quiz/add', {
						title: 'Add New Que. Ans.',
						question: quenansdata.question		
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('quiz/add', {
						title: 'Add New Que. Ans.'				
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('quiz/add', { 
            title: 'Add New Que. Ans.',
			question: req.body.question
        })
    }
})

app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM queans WHERE qa_id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Question Answer not found with id = ' + req.params.id)
				res.redirect('quiz')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('quiz/edit', {
					title: 'Edit', 
					//==data: rows[0],
					qa_id: rows[0].qa_id,
					question: rows[0].question,
					option: rows[0].option,
					answer: rows[0].answer,
					usetime: rows[0].usetime				
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.post('/edit/(:id)', function(req, res, next) {
	req.assert('question', 'Question is required').notEmpty()
	req.assert('option', 'Option is required').notEmpty()
    req.assert('answer', 'Answer is required').notEmpty() 

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var option_array = req.body.option;
		var optionobj = option_array.reduce(function(o, val) { o[val] = val; return o; }, {});
		var optiondata = JSON.stringify(optionobj);
		
		req.getConnection(function(error, conn) {
			conn.query("UPDATE queans SET question='"+ req.body.question +"',option='"+ optiondata +"',answer='"+ req.body.answer +"',usetime='"+ req.body.usetime +"' WHERE qa_id  = '"+ req.params.id +"'", function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('quiz/edit', {
						title: 'Edit',
						qa_id: req.params.id,
						question: req.body.question,
						option: req.body.option,
						answer: req.body.answer,
						usetime:req.body.usetime
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					res.render('quiz/edit', {
						title: 'Edit',
						qa_id: req.params.id,
						question: req.body.question,
						option: req.body.option,
						answer: req.body.answer,
						usetime:req.body.usetime
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('quiz/edit', { 
            title: 'Edit',            
			qa_id: req.params.id,
			question: req.body.question,
			option: req.body.option,
			answer: req.body.answer,
			usetime:req.body.usetime
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM queans WHERE qa_id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/quiz')
			} else {
				req.flash('success', 'Question Answer deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/quiz')
			}
		})
	})
})

module.exports = app
