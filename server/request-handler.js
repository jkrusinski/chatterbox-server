/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/
// creates messages collection in database
var db = require('diskdb');
db = db.connect(__dirname + '/db', ['messages']);

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var routeOkay = request.url.substring(0, 17) === '/classes/messages';

  console.log('REQUEST URL ', request.url.substring(0, 17));

  console.log('REQUEST METHOD ', request.method);
  var headers = defaultCorsHeaders;
  
  headers['Content-Type'] = 'application/json';

  if (request.method === 'OPTIONS' && routeOkay) {

    response.writeHead(200, headers);
    response.end();

  } else if (request.method === 'GET' && routeOkay) {

    var messages = db.messages.find();

    messages.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0;
    });

    response.writeHead(200, headers);
    response.end(`{"results":${JSON.stringify(messages)}}`);

  } else if (request.method === 'POST' && routeOkay) {

    var body = [];

    request.on('data', function(chunk) {

      body.push(chunk);

    });
    request.on('end', function() {

      body = Buffer.concat(body).toString();
      
      body = JSON.parse(body);
      body.createdAt = new Date();
      
      db.messages.save(body);

      response.writeHead(201, headers);
      response.end('{"message": "success"}');
    });

  } else {

    response.writeHead(404, headers);
    response.end();
  }

};

exports.requestHandler = requestHandler;

