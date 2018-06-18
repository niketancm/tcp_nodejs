#!/usr/bin/env node
'use strict';

// const mongoose = require('mongoose');
const mongodb = require('mongodb').MongoClient; //load the mongodb native driver
const net = require('net');  // load the Node.js TCP library

const URL = 'mongodb://localhost:27017/esya-test1'
// mongoose.connect('mongodb://localhost:27017/esya-test'); //connect to the database
// mongoose.connect('mongodb://localhost:27017/esya-test1'); //connect to the database

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
        let temp = data.toString();
        console.log(temp);
        // getting the string message and also trimming
        // new line characters [\r or \n] and push to dataQueue
        let m = temp.replace(/[\n\r]*$/, '');
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
                    //save the incoming data to the mongoose model to be inserted
                    MongoClient.connect(URL, function(err, db){
                        if(err) throw err;
                        dbo = db.db("esya-test");
                        var insertData = {
                            
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
    });
}
