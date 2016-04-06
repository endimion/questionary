var views = require("./views");
var mysql = require('mysql');


function questions(response,request,classId){
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
                                var qString  = "select * from questions where classnumber=\'"+classId+"\';";
				console.log(qString);
                                var query = connection.query(qString, function(err, result){
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



function upload(res,req,classId){
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
        	if(parseInt(qid) < 10 ){
                	console.log("have more questions to answer ");
	                //router.route(handle,'question',res,req);
	                res.redirect('/question');
        	}else{
                	console.log("thank you for your participation");
	                res.set('Content-Type', 'text/html');
        	        res.send(new Buffer('<p>Τέλος Quiz</p>'));
        	}//end of else



}//end of upload


function answers_old(res,req,classId){

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
							var anString = " <div class='question'> Ερώτηση: </br>"+ result[i].question + "</div></br> Απαντήσεις: </br>" ;
							var quest = result[i].question;
							//console.log('question' + ques);
							anString += '<div class="answer"> <ul>';
							for(var j=0; j < result.length; j++){
								//console.log("comparing " + quest + " " + result[j].question);
								if(result[j].question == quest){

								    anString += '<li> '+ result[j].answer + "</li> </br>"
								    //console.log("will append answer :" + result[j].answer);
								}
							}
							anString +="</ul></div>"
	                                                // ans.push("  Ερώτηση: " + result[i].question +"</br>"+ "Απάντηση: "+ result[i].answer +"/<br>" );
							ans.push(anString);
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



function answers(res,req,classId){

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
						var dict =[];

						for(var i=0; i < result.length;i++){
							if(dict[result[i].question] === undefined ){
								dict[result[i].question] = [result[i].answer];
								//console.log(dict[result[i].question]);
							}else{
								dict[result[i].question].push(result[i].answer);
							}

						}//end of looping through the resutls from the db

					       var anString ="";
					       var answers = "";
					       var ans ="";
					       for (var key in  dict){
							anString = "<div class='question'> Ερώτηση: <li>  " + key + "</li>";
							answers = "<div class='answer'>Απαντήσεις:<ul>  ";
							for(var j=0; j< dict[key].length;j++){

							    answers += "<li>" + dict[key][j] + "</li>";
							}//end of looping through the answers
							answers += "</ul></div> </div>"
							ans += anString + answers;
						}//end of looping through the questions


						console.log(" question " + anString);
						console.log("answers" + answers);
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
