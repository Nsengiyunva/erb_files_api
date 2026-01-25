import { Server } from 'socket.io';

let io;

export const initSocket = server => {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  return io;
};

export const emitEvent = (event, data) => {
  if (io) io.emit(event, data);
};
