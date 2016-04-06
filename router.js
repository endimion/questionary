function route(handle,pathname,response,request,classId){
//this function takes as input a dictionary of functions that  can answer requests
// the pathname and a response and request object
// and uses the appropriate handlerRequest function to manage the request
	console.log("Route function called to route request for " + pathname);
	if(typeof handle[pathname] == 'function'){
		console.log('class id = ' + classId);	
		handle[pathname](response,request,classId);
	}else{
		console.log("no handler found for requested path" + pathname);
		response.writeHead(404,{"Content-Type":"text/plain"});
	        response.write("404 NOT found :( ");
	        response.end();
	}
}
exports.route = route;
