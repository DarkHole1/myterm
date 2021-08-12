import express from 'express';
import http from 'http';
import https from 'https';
import { Server } from "socket.io";
import initializeSockets from './socket-handler';
import AuthMiddleware from './auth';
import StaticMiddleware from './static';
import APIMiddleware from './api';
import Config from './config';
import init from './init-server';

const config = new Config('.config.json');

const app = express();
// const server = http.createServer(app);
const server = init(app);
const io = new Server(server);
const log = require('debug')('app:server');
import mongoose from 'mongoose';
mongoose.connect('mongodb://mongodb/myterm', { useNewUrlParser: true, useUnifiedTopology: true })

initializeSockets(io, config);

app.use(AuthMiddleware);
app.use(StaticMiddleware);
app.use('/api/', APIMiddleware(config));

server.listen(3000)
