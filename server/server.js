const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const log = require('debug')('app:server');
const TCPSocket = require('./socket');

app.use(require('./static'));

io.on('connection', (socket) => {
  log('Client connected');
  let client = null;


  socket.on('client', ([host, port]) => {
    log('Connecting to remote');
    socket.emit('status', 'Connecting');

    client = new TCPSocket(host, port, () => {
      log('Connected to remote');
      socket.emit('status', 'Connected');
    });

    client.onData((data) => {
      socket.emit('data', data);
    });

    client.onError((err) => {
      log('Error in remote: %o', err);
      client = null;
      socket.emit('status', 'Error');
    });

    client.onClose(() => {
      if(client == null) return;
      client = null;
      socket.emit('status', 'Disconnected');
    })
  });

  socket.on('data', (data) => {
    if(client === null) {
      log('Data received, but remote not connected');
      socket.emit('status', 'Disconnected');
      return;
    }

    client.write(data);
  });

  socket.on('disconnect', () => {
    log('Client diconnected');
    if(client !== null) client.close();
  })
})

server.listen(3000)
