var http = require('http');

var options = {
    host: 'mutant-school.herokuapp.com',
    path: '/api/v1/mutants',
};

http.request(options, function(response){
    var str = '';

    response.on('data', function(data){
        str += data;
    });

    response.on('end', function(){
        console.log(str);
    });
}).end();
