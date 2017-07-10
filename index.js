import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import Server from './server';

const app = express();
const httpServer = http.Server(app);
const io = socketio(httpServer);
const port = process.env.PORT || 3000;

app.use('/', express.static(__dirname + '/public'));

const server = new Server()
server.init(io);

httpServer.listen(port, function(){
  console.log(`listening on *:${port}`);
});