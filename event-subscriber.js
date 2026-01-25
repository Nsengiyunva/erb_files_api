import { subscriber } from './events.js';
import { emitEvent } from './socket.js';

subscriber.subscribe('document-events');

subscriber.on('message', (_, message) => {
  const event = JSON.parse(message);
  emitEvent(event.type, event.payload);
});
