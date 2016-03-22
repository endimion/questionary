var http = require("http");
var url = require("url");



function start(route,handle,request,response){

	function onRequest(request,response){
		pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received");
		route(handle,pathname,response,request);
	}

	onRequest(request,response);

	//http.createServer(onRequest).listen(8888);
	//console.log("server has started");
}

exports.start = start;

