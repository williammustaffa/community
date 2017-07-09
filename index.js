import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import Server from './server';

const app = express();
const httpServer = http.Server(app);
const io = socketio(httpServer);

app.use('/', express.static(__dirname + '/public'));

const server = new Server()
server.init(io);

httpServer.listen(3000, function(){
  console.log('listening on *:3000');
});