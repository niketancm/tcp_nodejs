#!/usr/bin/env node
'use strict';
//for data to be pushed into database
// const models = require('./data-models/models');
const mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb://localhost:27017/myTestDB`');

var db = mongoose.connection;

//check the connection to mongodb
db.on('error', function (err) {
    console.log('connection error', err);
    });
    
    db.once('open', function () {
    console.log('connected.');
    });       

//define a schema
var Schema = mongoose.Schema;

var dataSchema = new Schema ({
    // DATETIME: Date,
    // REGION: String,
    // LOCATION: String,
    // PLANT: String,
    // LINE: String,
    // MODEL: String,
    // OPERATOR: String,
    // DEVICEID: String,
    PARAMATER: String,
    DATA: Number
});
//define the model for the schema
mongoose.model('data', dataSchema);

//configure the data model    
// var dataModel = mongoose.model('dataModel',     dataSchema);

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
        var Data = mongoose.model('data');
        const dataInsert = new Data;
      // split the message
      var incomingData = m.split(',');
    //   incomingData[9] = parseFloat(incomingData[9]);
      dataInsert.PARAMATER = incomingData[0];
      dataInsert.data = data[1];

      dataInsert.save(function(error){
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
  