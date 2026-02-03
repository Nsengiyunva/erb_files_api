// import { Worker } from 'bullmq';
// import connection from './config/connection.js';
// import { Document, ERBPaidList, sequelize } from './models/index.js';
// import { publisher } from './events.js';

// await sequelize.authenticate();
// console.log('✅ DB connected (worker)');

// const worker = new Worker(
//   'document-queue',
//   async (job) => {
//     console.log('📥 Job received:', job.data);

//     const { filename, filepath, filesize, license_no } = job.data;

//     let isCreated = false;

//     await sequelize.transaction(async (txn) => {
//       const [doc, created] = await Document.findOrCreate({
//         where: { filepath },
//         defaults: { filename, filesize },
//         transaction: txn
//       });

//       isCreated = created;

//       await ERBPaidList.update(
//         { license_status: 'UPLOADED' },
//         {
//           where: { license_no },
//           transaction: txn
//         }
//       );
//     });

//     // ✅ publish ONCE, AFTER successful commit
//     if (isCreated) {
//       await publisher.publish(
//         'document-events',
//         JSON.stringify({
//           type: 'file:new',
//           payload: {
//             filename,
//             filesize,
//             created_at: new Date()
//           }
//         })
//       );
//     }

//     console.log(`✅ Registered: ${filename}`);
//   },
//   { connection }
// );

// worker.on('failed', (job, err) => {
//   console.error(`❌ Job ${job?.id} failed:`, err);
// });


import { Worker } from 'bullmq';
import connection from './config/connection.js';
import { Document, ERBPaidList, sequelize } from './models/index.js';
import { publisher } from './events.js';

async function startWorker() {
  // ✅ Ensure DB is ready before worker starts
  await sequelize.authenticate();
  console.log('✅ DB connected (worker)');

  const worker = new Worker(
    'document-queue',
    async (job) => {
      console.log('📥 Job received:', job.data);

      const { filename, filepath, filesize, license_no } = job.data;

      let isCreated = false;

      await sequelize.transaction(async (txn) => {
        const [, created] = await Document.findOrCreate({
          where: { filepath },
          defaults: { filename, filesize },
          transaction: txn
        });

        isCreated = created;

        // ✅ Guard against undefined license_no
        if (license_no) {
          await ERBPaidList.update(
            { license_status: 'UPLOADED' },
            {
              where: { reg_no: license_no },
              transaction: txn
            }
          );
        }
      });

      // ✅ Publish only AFTER successful commit
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

  // 🔍 Useful lifecycle logs
  worker.on('ready', () => {
    console.log('👷 Worker is ready and listening');
  });

  worker.on('active', (job) => {
    console.log(`⚡ Processing job ${job.id}`);
  });

  worker.on('completed', (job) => {
    console.log(`🎉 Completed job ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  // 🧼 Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down worker...');
    await worker.close();
    process.exit(0);
  });
}

// 🚀 Boot the worker
startWorker().catch((err) => {
  console.error('❌ Worker startup failed:', err);
  process.exit(1);
});
