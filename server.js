import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const PORT =8992;

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Listen for socket connections
io.on('connection', socket => {
  console.log('🟢 Client connected:', socket.id);

  // Receive message from client
  socket.on('send_message', data => {
    console.log('📨 Message received:', data);

    // Broadcast to all clients
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

server.listen( PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
