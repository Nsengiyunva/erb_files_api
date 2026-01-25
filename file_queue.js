import { Queue } from 'bullmq';
import connection from './config/connection.js';

export const fileQueue = new Queue('document-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: true
  }
});
