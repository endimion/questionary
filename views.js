var mysql = require('mysql');

function questionsView(request,question){

	return '<html>'+
		'<head>'+
		 '<link rel="stylesheet" type="text/css" href="style.css">'+
                  '<meta http-equiv="Content-Type" content="text/html; '+
                   'charset=UTF-8"/>'+
	        '</head>'+
        '<body>'+
		'<div class="question"> Ερώτηση: </br> </br> ' + question+' </div>'
		+
                '<form action="/upload" method="post">'+
                        '<textarea name="text" rows="20" cols="60"></textarea>'+
                        '<input type="submit" value="Submit text" />'+
                '</form>'+
        '</body>' +
        '</html>';


}



function answerView(request,ans){
	var anString ="";
	for(var i=0; i < ans.length;i++){
		anString += '<li>'+ans[i]+'</li>';
	}



        return '<html>'+
                '<head>'+
		 '<link rel="stylesheet" type="text/css" href="style.css">'+
                '<meta http-equiv="Content-Type" content="text/html; '+
                'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
                '<div> Answers = <ul> ' + ans+' </ul></div>'
        '</body>' +
        '</html>';


}



exports.questionsView = questionsView; 
exports.answerView = answerView;
