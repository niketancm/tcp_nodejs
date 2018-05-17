#!/usr/bin/env node
'use strict';
//for data to be pushed into database
const models = require('./data-models/models');

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

      // split the message
      var incomingData = m.split(',');
      incomingData[9] = parseFloat(incomingData[9]);

      var dataWrite = new dataModel({
          DATETIME: incomingData[0],
          REGION: incomingData[1],
          LOCATION: incomingData[2],
          PLANT: incomingData[3],
          LINE: incomingData[4],
          MODEL: incomingData[5],
          OPERATOR: incomingData[6],
          DEVICEID: incomingData[7],
          PARAMATER: incomingData[8],
          DATA: incomingData[9]
      });

      incomingData.save(function(error){
          console.log("Your data has been saved!");
          if(error) {
              console.error(error);
          }
      })

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
  