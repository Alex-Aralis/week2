var http = require('http');
var fs = require('fs');
var url = require('url');

var port = 8080;

http.createServer(function(request, response){
    var pathname = url.parse(request.url).pathname;

    console.log(pathname);

    fs.readFile(pathname.substring(1), function(err, data){
        if(err){
            console.log(err);
            response.writeHead(404, {'Content-Type': 'text/plain'});
        }else{
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write(data.toString());
        }
    
        response.end();
    });
}).listen(port);

console.log(port);
