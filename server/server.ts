import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";
import initializeSockets from './socket-handler';
import AuthMiddleware from './auth';
import StaticMiddleware from './static';
import APIMiddleware from './api';
import Config from './config';
import init from './init-server';
import cookie from 'cookie-parser';

const config = new Config('.config.json');

const app = express();
// const server = http.createServer(app);
const server = init(app);
const io = new Server(server);
const log = require('debug')('app:server');
log('Starting server...');
import mongoose from 'mongoose';
mongoose.connect(config.mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    log('DB connected, error: %o', err);
    log('DB uri "%s"', config.mongodbURI);
})

initializeSockets(io, config);

app.use(StaticMiddleware);
// For debug purposes
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(cookie());
app.use(AuthMiddleware);
app.use('/api/', APIMiddleware(config));

server.listen(3000, () => {
   log('Server listening on port 3000'); 
})
