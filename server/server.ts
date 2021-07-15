import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import initializeSockets from './socket-handler';
import AuthMiddleware from './auth';
import StaticMiddleware from './static';
import Config from './config';
import { TerminalInfo } from './user';

const config = new Config('config.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const log = require('debug')('app:server');
import mongoose from 'mongoose';
import { ITerminal } from './terminal';
mongoose.connect('mongodb://mongodb/myterm', {useNewUrlParser: true, useUnifiedTopology: true})

initializeSockets(io, config);

app.use(AuthMiddleware);
app.use(StaticMiddleware);

app.get('/terminals', (req: any, res) => {
  res.json(req.user.terminals.map((info: TerminalInfo) => {
    return {
      id: info.terminal._id,
      name: info.terminal.name,
      readonly: info.readonly,
      editable: req.user.admin
    }
  }));
})

app.get('/terminalsInfo', (req: any, res) => {
  if(req.user.admin) {
    res.json(req.user.terminals.map((el: TerminalInfo) => el.terminal));
  } else {
    res.json([]);
  }
})

app.get('/postedit', (req: any, res) => {
  if(req.user.admin) {
    req.user.terminals
      .map((e: TerminalInfo) => e.terminal)
      .filter((t: ITerminal) => t.name == req.query.name)
      .forEach((t: ITerminal) => {
        t.host = req.query.host;
        t.port = req.query.port;
        t.name = req.query.newName;
        t.save();
      });
  }
  res.redirect('/');
})

server.listen(3000)
