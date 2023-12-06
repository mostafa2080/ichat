const express = require('express');
const { set } = require('express/lib/application');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT}....`);
});
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', onConnection);

const connectedClients = new Set();
function onConnection(socket) {
  console.log(`New Connection : `, socket.id);
  connectedClients.add(socket.id);
  io.emit('clientCount', connectedClients.size);

  socket.on('disconnect', () => {
    console.log(`Disconnected from client:`, socket.id);
    connectedClients.delete(socket.id);
    io.emit('clientCount', connectedClients.size);
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-msg', data);
  });

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback-msg', data);
  });
}
