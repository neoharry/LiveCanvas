var WebSocketServer = require('websocket').server;
var http = require('http');
var connectionPool = [];

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
   autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
  }


wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    connectionPool.push(connection);
    connection.id = connectionPool.length;

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
   	    	for(var i = 0; i < connectionPool.length; i++) {
	            if(connectionPool[i] === connection)
					continue;
		    	connectionPool[i].sendUTF(message.utf8Data);
	    	}
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
	for(var i = 0; i < connectionPool.length; i++) {
		if( connectionPool[i] === connection ) {
			connectionPool.splice(i,1);
		}
	}	
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
