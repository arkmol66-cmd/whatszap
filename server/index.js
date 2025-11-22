const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Em memória (troque por DB se quiser)
let users = {}; // socketId -> {username}
let rooms = {}; // roomId -> [messages...]

io.on('connection', (socket) => {
  console.log('novo socket conectado', socket.id);

  socket.on('login', (username) => {
    users[socket.id] = { username };
    io.emit('users', Object.values(users).map(u => u.username));
  });

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} entrou em ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('send_message', ({ roomId, message, from }) => {
    const msg = { from, message, timestamp: Date.now() };
    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push(msg);
    io.to(roomId).emit('new_message', msg);
  });

  socket.on('get_history', (roomId, cb) => {
    cb(rooms[roomId] || []);
  });

  socket.on('disconnect', () => {
    console.log('desconectou', socket.id);
    delete users[socket.id];
    io.emit('users', Object.values(users).map(u => u.username));
  });
});

app.get('/', (req, res) => res.send({ status: 'ok', now: Date.now() }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
