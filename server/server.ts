import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import initializeSockets from './socket-handler';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const log = require('debug')('app:server');
import mongoose from 'mongoose';
mongoose.connect('mongodb://mongodb/myterm', {useNewUrlParser: true, useUnifiedTopology: true})

initializeSockets(io);

app.use(require('./auth'));
app.use(require('./static'));

app.get('/terminals', (req: any, res) => {
  res.json(req.user.terminals.map(({ name }: any) => name));
})

server.listen(3000)
