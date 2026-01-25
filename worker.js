import { Worker } from 'bullmq';
import connection from './config/connection.js';
import { Document } from './models/index.js';
import { publisher } from './events.js';

const worker = new Worker(
  'document-queue',
  async job => {
    const { filename, filepath, filesize } = job.data;

    const [doc, created] = await Document.findOrCreate({
      where: { filepath },
      defaults: { filename, filesize }
    });

    if (created) {
      await publisher.publish(
        'document-events',
        JSON.stringify({
          type: 'file:new',
          payload: {
            filename,
            filesize,
            created_at: new Date()
          }
        })
      );
    }

    console.log(`✅ Registered: ${filename}`);
  },
  { connection }
);

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});
