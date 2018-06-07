const net = require('net');

const HOST = '127.0.0.1';
const PORT = 5000;

    var client = new net.Socket();
    client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT); 
    });

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
    client.on('data', function(data) {
        let incomingData = data.toString().replace(/[\n\r]*$/, '');

        if(incomingData == "101"){
            client.write("ttknode10");
        }else{
            console.log(incomingData);
        }
    });

// Add a 'close' event handler for the client socket
    client.on('close', function() {
    console.log('Connection closed');
    });