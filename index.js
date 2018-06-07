'use strict';
const { createServer } = require('net');

const server = createServer();

let counter = 0;
const sockets = {};
// var id = "";
// const inputSockets = {};
// const outputSockets = {};

server.on('connection', (socket) => {
  socket.id = counter++;
  sockets[socket.id] = socket;
  socket.write("A client has connected\n");
  // console.log(sockets[counter - 1].id);
  console.log("\n");

  socket.on('data', data => {
    var arr = Object.entries(sockets);
    console.log(sockets);
    console.log("hello WRITING");    
    // console.log(arr);
    arr.forEach(([key, cs]) => {
      if(sockets.id != key){
        cs.write(data);
      }
    });
    // Object.entries(sockets).forEach(([key, cs]) => {
    //   if(sockets.id != key) {
    //     cs.write(data);
    //   }
    // });
  });
});

server.listen(3000, () => {
  console.log('server has started')
});