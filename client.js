const net = require('net');

// const HOST = '127.0.0.1';
const HOST = 'ec2-184-72-73-164.compute-1.amazonaws.com';
const PORT = 5000;
var mess = 'ttkId10,tn,hosur,p1,l1,m1,op1,d1,temp,'
// var tempData = [23.147,23.117,23.105,23.096,23.123,23.124,23.118,23.098,23.151,23.116,23.153,23.154,23.096,
// 23.126,23.124,23.122,23.156,23.144,23.115,23.096,23.117,23.106,23.135,23.159,23.106,23.121,23.109,23.100,23.129,23.165];
// console.log(tempData.length);

    var client = new net.Socket();
    client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT); 
    });

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
    client.on('data', function(data) {
        let incomingData = data.toString().replace(/[\n\r]*$/, '');
        console.log("data received:" + incomingData);
        if(incomingData === "101"){
            // console.log(incomingData[0]);
            console.log("CLIENT: supplying the IOT ID: ttkId10");
            client.write("ttkId10");
        }else if(incomingData === "send"){
            var  i = 1;
            console.log("CLIENT: got 'send' from server");
            var interval = setInterval(function () {
                if(i > (5000)){
                // if(i >= (tempData.length)){
                    clearInterval(interval);
                }
                // sendData = mess + tempData[i];
                sendData = mess + i ;//+ "##";
                console.log(sendData);
                client.write(sendData);
               i++;    
            }, 800);
        }
    });

// Add a 'close' event handler for the client socket
    client.on('close', function() {
    console.log('Connection closed');
    });