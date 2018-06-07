#!/usr/bin/env node
'use strict';

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
    PARAMETER: String,
    DATA: Number
});

// load the Node.js TCP library
const net = require('net');

const PORT = 5000;
// const ADDRESS = '0.0.0.0'; //to listen to all incoming data
const ADDRESS = '127.0.0.1'; //to listen to all localhost

var iotSockets = {};
var streamReq = {};
var iotId = "ttkId10";
var streamId = "ttknode10";

let server = net.createServer(onClientConnected);
server.listen(PORT, ADDRESS);

function onClientConnected(socket) {

    // Giving a name to this client
    let clientName = `${socket.remoteAddress}:${socket.remotePort}`;
    // Logging the message on the server
    console.log(`${clientName} connected.`);
    socket.write("101\n")

    // Triggered on data received by this client
    socket.on('data', (data) => {
        // let clientName = `${socket.remoteAddress}:${socket.remotePort}`;
        // getting the string message and also trimming
        // new line characters [\r or \n]
        let m = data.toString().replace(/[\n\r]*$/, '');
        // split the message
        var incomingData = m.split(',');
        if(incomingData[0] === streamId){ //this is a req conn to stream
            if(!streamReq[clientName]){//new connection
                //register the scoket as a key value pair, key: clientname and value: socket
                streamReq[clientName] = socket;
            }else{//connection already present
                return;
            }
        }else{//not stream id, these are iot connections
            if(!iotSockets[clientName]){//new iot connectons
                //register the scoket as a key value pair, key: clientname and value: socket
                iotSockets[clientName] = socket;
            }else{//iot connections already there, insert data

                //define a model dataModel
                var Data = mongoose.model('dataModel',dataSchema);
                const dataInsert = new Data;
                // for all the 10 input parameters exluding the date
                incomingData[9] = parseFloat(incomingData[9]);

                //for 9 inputs not considering id
                // incomingData[8] = parseFloat(incomingData[8]);
                // //for just the two elements, last data is float type
                // //incomingData[1] = parseFloat(incomingData[1]);

                //save the incoming data to the mongoose model to be inserted
                dataInsert.REGION = incomingData[1];
                dataInsert.LOCATION = incomingData[2];
                dataInsert.PLANT = incomingData[3];
                dataInsert.LINE = incomingData[4];
                dataInsert.MODEL= incomingData[5];
                dataInsert.OPERATOR = incomingData[6];
                dataInsert.DEVICEID = incomingData[7];
                dataInsert.PARAMETER = incomingData[8];
                dataInsert.DATA = incomingData[9];
                //console.log(dataInsert.PARAMATER);
                //console.log(dataInsert.DATA);
                dataInsert.save(function(error){
                    if(error) {
                      //   console.error(error);
                      console.log('Send the data in correct format');
                    }else{
                      console.log("Your data has been saved!");
                    }
                });
                // Logging the message on the server
                // console.log(`${clientName} said: ${m}`);

                //Send the data to the clients in reqSockets
                // socket.write(`We got your message (${m}). Thanks!\n`);
                Object.entries(streamReq).forEach(([key, cs]) => {
                    cs.write(incomingData[9]);
                    // cs.write(incomingData[1]);                    
                });
            }
        }
    });
    // Triggered when this client disconnects
    socket.on('end', () => {
        // Logging this message on the server
        console.log(`${clientName} disconnected.`);
    });
}
