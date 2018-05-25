#!/usr/bin/env node
'use strict';
//for data to be pushed into database
// const models = require('./data-models/models');
const mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb://localhost:27017/myTestDB1');

var db = mongoose.connection;

//check the connection to mongodb
db.on('error', function (err) {
    console.log('connection error', err);
    });
    
    db.once('open', function () {
    console.log('connected to MONGO!.');
    });       

//define a schema
var Schema = mongoose.Schema;
var dataSchema = new Schema ({
    // DATETIME: Date,
    REGION: String,
    LOCATION: String,
    PLANT: String,
    LINE: String,
    MODEL: String,
    OPERATOR: String,
    DEVICEID: String,
    PARAMATER: String,
    DATA: Number
});

//define the model for the schema
// mongoose.model('dataModel', dataSchema);

//configure the data model    
// var dataModel = mongoose.model('dataModel',     dataSchema);

// load the Node.js TCP library
const net = require('net');

const PORT = 5000;
const ADDRESS = '0.0.0.0'; //to listen to all incoming data

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

      //define a model dataModel
      var Data = mongoose.model('dataModel', dataSchema);
      const dataInsert = new Data;
      
      // split the message
      var incomingData = m.split(',');
      
      // for all the 10 input parameters
      //incomingData[9] = parseFloat(incomingData[9]);
      //for 9 inputs not considering date
      incomingData[8] = parseFloat(incomingData[8]);
      
      
      //for just the two elements, last data is float type
    //   incomingData[1] = parseFloat(incomingData[1]);

      //save the incoming data to the mongoose model to be inserted
        dataInsert.REGION = incomingData[0];
        dataInsert.LOCATION = incomingData[1];
        dataInsert.PLANT = incomingData[2];
        dataInsert.LINE = incomingData[3];
        dataInsert.MODEL= incomingData[4];
        dataInsert.OPERATOR = incomingData[5];
        dataInsert.DEVICEID = incomingData[6];
        dataInsert.PARAMATER = incomingData[7];
        dataInsert.DATA = incomingData[8];

      console.log(dataInsert.PARAMATER);
      console.log(dataInsert.DATA);

      dataInsert.save(function(error){
          if(error) {
            //   console.error(error);
            console.log('Send the data in correct format');
          }else{
            console.log("Your data has been saved!");
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
