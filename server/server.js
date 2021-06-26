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

server.listen(3000)
