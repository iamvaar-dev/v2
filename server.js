const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

const userPool = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', ({ name }) => {
    const user = { id: socket.id, name };
    userPool.push(user);
    console.log(`${name} joined the chat`);

    const availablePeer = userPool.find(u => u.id !== user.id);
    if (availablePeer) {
      io.to(user.id).emit('peer', availablePeer);
      io.to(availablePeer.id).emit('peer', user);
      userPool.splice(userPool.indexOf(availablePeer), 1);
      userPool.splice(userPool.indexOf(user), 1);
    } else {
      socket.emit('waiting');
    }
  });

  socket.on('message', (message) => {
    io.to(message.peerId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    const index = userPool.findIndex(u => u.id === socket.id);
    if (index > -1) {
      const [disconnectedUser] = userPool.splice(index, 1);
      io.to(disconnectedUser.peerId).emit('peer-disconnected');
    }
  });
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
});
