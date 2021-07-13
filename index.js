/*const express = require("express");
const socket = require("socket.io")({
  allowEIO3: true // false by default
});


// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

console.log('hi', socket.sockets.server);
// Socket setup
const io = socket.sockets(server);

console.log('hi here');
io.on("connection", function (socket) {
  console.log("Made socket connection");
});

io.on("chat message", function (data) {
    io.emit("chat message", data);
});*/

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/*app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
*/
app.use(express.static("public"));

const activeUsers = new Set();
const activeSockets = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  
  const socketId = socket.id;
  console.log('socketId', socketId)
  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);

    activeSockets[socketId] = data;

    io.emit("new user", [...activeUsers]);
    io.emit("chat message", `System Message: ${data} has joined the room!`)
  });

  socket.on('disconnect', () => {
    let departedUser = activeSockets[socketId];
    activeUsers.delete(departedUser);
    io.emit("chat message", `System Message: ${departedUser} has left the room!`)
    io.emit("remove user", departedUser)
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});