#!/usr/bin/env node
'use strict';

// load the Node.js TCP library
const net = require('net');

const PORT = 5000;
const ADDRESS = '127.0.0.1';

let server = net.createServer(onClientConnected);
server.listen(PORT, ADDRESS);

function onClientConnected(socket) {

    // Giving a name to this client
    let clientName = `${socket.remoteAddress}:${socket.remotePort}`;

    // Logging the message on the server
    console.log(`${clientName} connected.`);

    // Triggered on data received by this client
    socket.on('data', (data) => {

      // getting the string message and also trimming
      // new line characters [\r or \n]
      let m = data.toString().replace(/[\n\r]*$/, '');

    //   var messageArray = m

      // Logging the message on the server
      console.log(`${clientName} said: ${m}`);

      // notifing the client
      socket.write(`We got your message (${m}). Thanks!\n`);
    });

    // Triggered when this client disconnects
    socket.on('end', () => {
        // Logging this message on the server
        console.log(`${clientName} disconnected.`);
    });
}
  