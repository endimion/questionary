var views = require("./views");
var mysql = require('mysql');


function questions(response,request){
	console.log("Request handler 'questions' was called");
	//request.session.id = '2';


	//var qid = request.session.qId ;
        var qid = request.session.qId;
        var connection = mysql.createConnection({
                                host     : 'localhost',
                                user     : 'root',
                                password : 'panathinaikos',
                                database: 'Java_course_questions'
                                });

                connection.connect(function(err) {
                        if(! err){
                        	//console.log('connected to db');
                                var query = connection.query('select * from questions', function(err, result){
                                        if(!err){
                                                //console.log("Retrieve results");
                                                //console.log(result);
						var body = "QId not Found!!!";
                                                for (var i = 0; i < result.length; i++) {
                                                    if(i+1 == qid){ 
                                                                console.log(result[i].question);
                                                                dispQ=result[i].question;
								//next we store the pk of the db for this question
								var pk  = result[i].id;
								//console.log("this primary key is " +pk);
								request.session.pk = pk.toString(); //store the key in the session
								body = views.questionsView(request,dispQ);
						   }//end of if
						}//end of for
						connection.end();
    						response.writeHead(200,{"Content-Type":"text/html"});
						response.write(body);
						response.end();

		                        }//enf if ! err
                              });//end of query
			}//end of !err
		   });//end of connect
		//connection.end();
}



function upload(res,req){
	console.log("Handling an upload request was called");

        var qid = req.session.qId;
	var pk = req.session.pk;
	req.session.qId = (parseInt(qid) +1).toString();
	console.log("new session qId is set to " + req.session.qId);

	var answer = req.body.text;
        //console.log("the abswer receuved ud " +answer);

        var connection = mysql.createConnection({
                                host     : 'localhost',
                                user     : 'root',
                                password : 'panathinaikos',
                                database: 'Java_course_questions'
                                });

        connection.connect(function(err) {
                        if(! err){
				var q = 'insert into answers (answer,question_id) values'+
                                                                ' (\"'+ answer+'\",'+pk+');';
				console.log('QUERY '+ q);
				var query = connection.query(q , function(err, result){
								if(!err){
									console.log("insertion was a success");
								}else{
									console.log("ERROR!!!" + err);
								}
								connection.end();
				});
			}//end if not err
		});

		console.log("new session qId is set to " + req.session.qId);
        	if(parseInt(qid) < 6 ){
                	console.log("have more questions to answer ");
	                //router.route(handle,'question',res,req);
	                res.redirect('/question');
        	}else{
                	console.log("thank you for your participation");
	                res.set('Content-Type', 'text/html');
        	        res.send(new Buffer('<p>Τέλος Quiz</p>'));
        	}//end of else



}//end of upload


function answers(res,req){

	var connection = mysql.createConnection({
                                host     : 'localhost',
                                user     : 'root',
                                password : 'panathinaikos',
                                database: 'Java_course_questions'
                                });

                connection.connect(function(err) {
                        if(! err){
                                //console.log('connected to db');
                                var query = connection.query('select * from answers_v', function(err, result){
                                        if(!err){
						var ans = [];
						for (var i = 0; i < result.length; i++) {
                                                    ans.push("  Ερώτηση: " + result[i].question +"</br>"+ "Απάντηση: "+ result[i].answer  );
                                                }//end of for
                                                var body = views.answerView(req,ans);
                                                connection.end();
                                                res.writeHead(200,{"Content-Type":"text/html"});
                                                res.write(body);
                                                res.end();
                                        }//enf if ! err
					else{
						console.log("ERROR!!! " +err);
					}
                              });//end of query
                        }//end of !err
                   });//end of connect
                //connection.end();




}//end of answers


exports.questions = questions;
exports.upload = upload;
exports.answers=answers;
