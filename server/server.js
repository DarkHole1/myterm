const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const log = require('debug')('app:server');
const TCPSocket = require('./socket');
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb/myterm', {useNewUrlParser: true, useUnifiedTopology: true})
const User = require('./user');

app.use(require('./auth'));
app.use(require('./static'));

app.get('/terminals', (req, res) => {
  res.json(req.user.terminals.map(({ name }) => name));
})

io.on('connection', async (socket) => {
  log('Client connected');
  let client = null;

  const req = socket.handshake;
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  const user = await User.findOne({ name: login, password: password });
  let readonly = true;

  socket.on('client', ([id]) => {
    log('Connecting to remote');
    socket.emit('status', 'Connecting');
    const { host, port } = user.terminals[id];
    readonly = user.terminals[id].readonly;

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
    if(readonly) {
      log('Data received, but connection readonly');
      return;
    }

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
