var server = require("./server");
var router = require("./router");
var requestHandler = require("./requestHandlers");
var handle={}; //dictionary that stores all requestHandlers functions to a key
var url = require('url');
//express stuff
var express = require('express');
var app = express();
var bodyParser = require('body-parser');



handle["/question"] = requestHandler.questions;
handle["/upload"]=requestHandler.upload;
handle["/answer"] = requestHandler.answers;

//server.start(router.route,handle);
//server.app("/");
var express = require('express');
var app = express();
// initialize the session
var session = require('express-session');
app.use(session({secret:'shhhh'}));
//initialize bodyParser used for handling post requests
app.use(bodyParser.json()); //to support JSON-encoded bodues
app.use(bodyParser.urlencoded({extended:true})); //to support URL-encoded bodies

//handling get requests through here
app.get('/*', function (req, res) {
  //res.send('Hello World!');
  pathname = url.parse(req.url).pathname;
  //console.log(pathname);

  if(req.session.qId == undefined){
  	req.session.qId ='1';
  }else{
	console.log("session qid already set");
  }

  router.route(handle,pathname,res,req);
});


//handling post requests through here
app.post('/upload', function(req,res){
	console.log("handling of POST request called!");
	router.route(handle,'/upload',res,req);
});




app.listen(3000,'147.102.206.227' ,function () {
  console.log('Example app listening on port 3000!');
});
