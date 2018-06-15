#!/usr/bin/env node
'use strict';

const mongoose = require('mongoose');
const net = require('net');  // load the Node.js TCP library

// mongoose.connect('mongodb://localhost:27017/esya-test'); //connect to the database
mongoose.connect('mongodb://localhost:27017/esya-test1'); //connect to the database

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
 //define a model dataModel
var Data = mongoose.model('dataModel',dataSchema);

const PORT = 5000;
const ADDRESS = '0.0.0.0'; //to listen to all incoming data
// const ADDRESS = '127.0.0.1'; //to listen to all localhost

// var iotSockets = {};
// var streamReq = {};
var iotSock = new Map();
var nodeSock =  new Map();
var iotId = "ttkId10";
var streamId = "ttknode10";
var socket;
var dataQueue = [];
var incomingData = [];
var data;

let server = net.createServer(onClientConnected);
server.listen(PORT, ADDRESS);

function onClientConnected(socket) {
    // Giving a name to this client
    let clientName = `${socket.remoteAddress}:${socket.remotePort}`;
    // Logging the message on the server
    // socket.write("101\n")
    // Triggered on data received by this client    
    socket.on('data', (data) => {
        console.log(data.toString());
        // getting the string message and also trimming
        // new line characters [\r or \n] and push to dataQueue
        let m = data.toString().replace(/[\n\r]*$/, '');
        // console.log(data);
        // dataQueue = data.toString().replace(/[\n\r]*$/, '');
        // dataQueue = data.toString();
        // console.log(dataQueue);
        // console.log("This is the DATAQUEUE in 'SOCKET.ON'" + dataQueue);        
        // split the message
        incomingData = m.split('##');
        for( var i = 0; i < (incomingData.length - 1); i++){
            var insert = incomingData[i].split(',');
            //register the scoket as a key value pair, key: clientname and value: socket
            if(insert[0] === streamId){ //this is a req conn from the nodejs/express
                if(!nodeSock.has(clientName)){
                    nodeSock.set(clientName, socket); //new connection
                }else{
                    return; //connection already present
                }
            }else{
                //For iot connections
                //register the socket as a {key,value} pair, key: clientname and value: socket                
                if(!iotSock.has(clientName)){//new iot connectons
                    iotSock.set(clientName, socket);
                    // Logging the message on the server
                    // console.log(`SERVER: IOT ${clientName} connected.`);
                    // console.log(`SERVER: Sending 'send' to client to send the data`);
                    // socket.write("send\n");
                    // return;
                }else{//iot connections already there, insert data
                    const dataInsert = new Data;
                    //save the incoming data to the mongoose model to be inserted
                    dataInsert.REGION = insert[1];
                    dataInsert.LOCATION = insert[2];
                    dataInsert.PLANT = insert[3];
                    dataInsert.LINE = insert[4];
                    dataInsert.MODEL= insert[5];
                    dataInsert.OPERATOR = insert[6];
                    dataInsert.DEVICEID = insert[7];
                    dataInsert.PARAMETER = insert[8];
                    dataInsert.DATA = parseFloat(insert[9]);
                    dataInsert.save(function(error){
                        if(error) {
                        //   console.error(error);
                        console.log('Send the data in correct format');
                        }else{
                          console.log("SERVER: Your data has been saved! " + insert[9]);
                        }
                    });
                    //Send the data to the clients in nodeSock
                    nodeSock.forEach(function (soc, client, nodeSock) {
                    soc.write(insert[9]);
                    });
                    // console.log(data.toString());
                    // console.log("This is the elements in dataQueue:" + dataQueue);
                }
            }
        }
    });
    // Triggered when this client disconnects
    socket.on('end', () => {
        // Logging this message on the server
        console.log(`${clientName} disconnected.`);
        //remove the sockets from the iotSock or nodeSock map
        if(iotSock.has(clientName)){
            iotSock.delete(clientName);
            // socket.destroy();
            // console.log(iotSock.size);                
        }else if(nodeSock.has(clientName)){
            nodeSock.delete(clientName);
            // socket.destroy();
            // console.log(iotSock.size);
        }
        // console.log("length of DATA OBJECT:" + data.toString().length);        
        // console.log(data.toString().length);
        // console.log("THIS IS DATA IN var data :");        
        // console.log(data.toString());
        // console.log("length of DATA QUEUE:" + dataQueue.length);
        // console.log(dataQueue.length);
        // console.log("THIS IS data IN var dataQueue :");        
        // console.log(dataQueue);
    });
}
