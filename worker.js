import { Worker } from 'bullmq';
import connection from './config/connection.js';
import { Document, ERBPaidList, sequelize } from './models/index.js';
import { publisher } from './events.js';

await sequelize.authenticate();
console.log('✅ DB connected (worker)');

const worker = new Worker(
  'document-queue',
  async (job) => {
    console.log('📥 Job received:', job.data);

    const { filename, filepath, filesize, license_no } = job.data;

    let isCreated = false;

    await sequelize.transaction(async (txn) => {
      const [doc, created] = await Document.findOrCreate({
        where: { filepath },
        defaults: { filename, filesize },
        transaction: txn
      });

      isCreated = created;

      await ERBPaidList.update(
        { license_status: 'UPLOADED' },
        {
          where: { license_no },
          transaction: txn
        }
      );
    });

    // ✅ publish ONCE, AFTER successful commit
    if (isCreated) {
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
  console.error(`❌ Job ${job?.id} failed:`, err);
});
