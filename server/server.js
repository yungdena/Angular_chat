/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

let userList = new Map();

io.on('connection', (socket) => {
  let userName = socket.handshake.query.userName;
  addUser(userName, socket.id);

  socket.broadcast.emit('user-list', [...userList.keys()]);

  socket.on('message', (msg) => {
    socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
  });

  socket.on('disconnect', () => {
    removeUser(userName, socket.id);
  });
});

function addUser(userName, id) {
  if (!userList.has(userName)) {
    userList.set(userName, new Set(id));
  } else {
    userList.get(userName).add(id);
  }
}

function removeUser(userName) {
  if (userList.has(userName)) {
    let userIds = userList.get(userName);
    if (userIds.size == 0) {
      userList.delete(userName);
    }
  }
}

http.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on ${process.env.PORT || 3000}`);
});
