const net = require('net');

const HOST = '127.0.0.1';
// const HOST = 'ec2-184-72-73-164.compute-1.amazonaws.com';
const PORT = 5000;
var mess = 'ttk, ttk, India, Coimbatore, plantC, ';
var mess1 = 'ttk, ttk, India, Hosur, plantH, ';

var deviceId = ['f60f6f09c53c47e788ee0955bb7d5331', '657d2f72e5617c932b79aff34a005b79', 'abac5afc8daf5ba851d8e7d819d621b7', '40840c841bee602487b2092a6cc9cb68', 'b49ae8103030ca3af6dbc85c6698737f', 'd8cc2f4cb5daa677950028327c6f4dbe', 'c6d1e3e53793e2bb86a2c3c528af51a0', 'aad4bd90b37ae8922cae4c4eda6508bc'];

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
            client.write("ttkId10##");
        }else if(incomingData === "send"){
            var  i = 4;
            console.log("CLIENT: got 'send' from server: Sending the client Info\n");
            var interval1 = setInterval(function () {
                if(i >= (7)){
                    clearInterval(interval1);
                }
                // sendData = mess + tempData[i];
                sendData = mess1 + deviceId[i] + "##";
                console.log(sendData);
                client.write(sendData);
                i++;
            }, 800);
            // i = 4;
            // var interval2 = setInterval(function () {
            //     if(i >= (7)){
            //         clearInterval(interval2);
            //     }
            //     // sendData = mess + tempData[i];
            //     sendData = mess1 + deviceId[i] + "##";
            //     console.log(sendData);
            //     client.write(sendData);
            //     i++;
            // }, 800);
        }
    });

// Add a 'close' event handler for the client socket
    client.on('close', function() {
    console.log('Connection closed');
    // clearInterval(interval);
    });