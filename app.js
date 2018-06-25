#!/usr/bin/env node
'use strict';

// const mongoose = require('mongoose');
const mongodb = require('mongodb').MongoClient; //load the mongodb native driver
const net = require('net');  // load the Node.js TCP library

const URL = 'mongodb://localhost:27017/'
// mongoose.connect('mongodb://localhost:27017/esya-test'); //connect to the database
// mongoose.connect('mongodb://localhost:27017/esya-test1'); //connect to the database

const PORT = 5000;
const ADDRESS = '0.0.0.0'; //to listen to all incoming data
// const ADDRESS = '127.0.0.1'; //to listen to all localhost


var fromIot = new Map();
var fromNode =  new Map();
var iotId = "ttkId10";
var streamId = "ttknode10";
var socket;
var dataQueue = [];
var incomingData = [];
var data;
var paraName = "";

let server = net.createServer(onClientConnected);
server.listen(PORT, ADDRESS);

function onClientConnected(socket) {
    // Giving a name to this client
    let clientName = `${socket.remoteAddress}:${socket.remotePort}`;
    // Logging the message on the server
    // socket.write("101\n")
    //try to Handle the ECONNRESET error
    socket.on('error', (err) => {
        console.log('Got an error \n');
        console.log(err);
    });

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
        //check the deviceID if it is correct
        //if it is correct deviceID send "deviceId and ok"
        // socket.write("")
        // split the message
        incomingData = m.split('##');
        for( var i = 0; i < (incomingData.length - 1); i++){
            var insert = incomingData[i].split(',');
            //register the socket as a key value pair, key: clientname and value: socket
            if(insert[0] === streamId){ //this is a req conn from the nodejs/express
                if(!fromNode.has(clientName)){
                    fromNode.set(clientName, socket); //new connection
                }else{
                    return; //connection already present
                }
            }else{ //handle config of each device
                if(insert[0] === "#config"){
                    paraName = insert[3];
                    var insertConfig = {
                        deviceId: insert[1],
                        modelName: insert[2],
                        paraName: insert[3],
                        USL: insert[4],
                        UCLx: insert[5],
                        mean: insert[6],
                        LCLx: insert[7],
                        LSL: insert[8]
                    }
                    //insert the config data
                    mongodb.connect(URL, function(err, db){
                        if(err) throw err;
                        var dbo = db.db("esya-config");
                        //config update to be handled
                        dbo.collection("config").insertOne(insertConfig, function(err, res){
                            if(err){
                                console.log("Could not be saved\n" + err);
                            }else{
                                console.log("Data saved\n");
                                // socket.write("Config OK\n");
                            }
                            db.close();
                        });
                    });
                }else{
                //register the socket as a {key,value} pair, key: clientname and value: socket  
                    if(!fromIot.has(clientName)){//new iot connectons
                        //handle the deviceID checking also store as a {key, value} pair, with key: deviceId and value:socket
                        fromIot.set(clientName, socket);
                        // Logging the message on the server
                        // console.log(`SERVER: IOT ${clientName} connected.`);
                        // console.log(`SERVER: Sending 'send' to client to send the data`);
                        // socket.write("send\n");
                        // socket.write(insert[0] + " OK \n");
                        // return;
                    }else{//iot connections already there, insert data
                        //save the incoming data to the mongodb using native driver
                        var insertData = {
                            deviceId: insert[0],
                            unitName: insert[1],
                            operationName: insert[2],
                            lineName: insert[3],
                            modelName: insert[4],
                            machineNo: insert[5],
                            componentNo: insert[6],
                            remarks: insert[7],
                            reason: insert[8],
                            action: insert[9],
                            status: insert[10],
                            option7: insert[11],
                            option8: insert[12],
                            option9: insert[13],
                            option10: insert[14],
                            date: insert[15],
                        };
                        mongodb.connect(URL, function(err, db){
                            if(err) throw err;
                            var dbo = db.db("testNew");
                            // for(var i = 6; i < insert.length; i++){
                            for(var i = 16; i < insert.length; i++){                            
                                let param = insert[i].split('=');
                                insertData[param[0]] = parseFloat(param[1]);
                            }
                            dbo.collection("transcation").insertOne(insertData, function(err, res){
                                if(err){
                                    console.log("Could not be saved\n" + err);
                                }else{
                                    console.log("Data saved\n");
                                }
                                db.close();
                            });
                        });
                        //Send the data to the clients in fromNode
                        fromNode.forEach(function (soc, client, fromNode) {
                        soc.write(insert[9]);
                        });
                        // console.log(data.toString());
                        // console.log("This is the elements in dataQueue:" + dataQueue);
                    }
                }
            }
        }
    });
    // Triggered when this client disconnects
    socket.on('end', () => {
        // Logging this message on the server
        console.log(`${clientName} disconnected.`);
        //remove the sockets from the fromIot or fromNode map
        if(fromIot.has(clientName)){
            fromIot.delete(clientName);
            // console.log(fromIot.size);                
        }else if(fromNode.has(clientName)){
            fromNode.delete(clientName);
            // console.log(fromIot.size);
        }
    });
}
