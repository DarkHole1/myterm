import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import initializeSockets from './socket-handler';
import AuthMiddleware from './auth';
import StaticMiddleware from './static';
import APIMiddleware from './api';
import Config from './config';
import { TerminalInfo } from './user';

const config = new Config('.config.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const log = require('debug')('app:server');
import mongoose from 'mongoose';
import { ITerminal } from './terminal';
import SocketManager from './socket-manager';
mongoose.connect('mongodb://mongodb/myterm', {useNewUrlParser: true, useUnifiedTopology: true})

initializeSockets(io, config);

app.use(AuthMiddleware);
app.use(StaticMiddleware);
app.use('/api/', APIMiddleware);

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
    log('Trying change terminal')
    const terminalInfo: TerminalInfo = req.user.getTerminalById(req.query.id);
    if(terminalInfo != null) {
      const { terminal } = terminalInfo;
      terminal.host = req.query.host;
      terminal.port = req.query.port;
      terminal.name = req.query.newName;
      terminal.save();
      log('Changes succesfull');
    }
  }
  res.redirect('/');
})

app.get('/restart', (req: any, res) => {
  log('Restarting terminal %o', req.query);
  const terminalInfo: TerminalInfo = req.user.getTerminalById(req.query.id);
  if(terminalInfo != null) {
    const { host, port } = terminalInfo.terminal;
    SocketManager.restart({ host, port, config });
  }

  res.redirect('/');
})

server.listen(3000)
