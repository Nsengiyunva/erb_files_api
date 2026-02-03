// import chokidar from 'chokidar';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileQueue } from './file_queue.js';

// // const WATCH_DIR = '/var/ugpass/destination';
// const WATCH_DIR = '/home/user1/ERB/uploads';

// console.log(`👀 Watching ${WATCH_DIR}`);

// const watcher = chokidar.watch(WATCH_DIR, {
//   persistent: true,
//   ignoreInitial: true,
//   awaitWriteFinish: {
//     stabilityThreshold: 2000,
//     pollInterval: 100
//   }
// });

// watcher.on('add', async filePath => {
//   try {
//     const stats = await fs.stat(filePath);
//     if (!stats.isFile()) return;

//     await fileQueue.add(
//       'register-file',
//       {
//         filepath: filePath,
//         filename: path.basename(filePath),
//         filesize: stats.size,
//         license_no: ""
//       },
//       {
//         jobId: filePath // 🔑 prevents duplicate jobs on PM2 restarts
//       }
//     );

//     console.log(`📬 Job queued: ${path.basename(filePath)}`);
//   } catch (err) {
//     console.error('Watcher error:', err.message);
//   }
// });


import chokidar from 'chokidar';
import fs from 'fs/promises';
import path from 'path';
import { fileQueue } from './file_queue.js';

const WATCH_DIR = '/var/ugpass/destination/';

console.log(`👀 Watching-1 ${WATCH_DIR}`);

const watcher = chokidar.watch(WATCH_DIR, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});

watcher.on('add', async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) return;

    const filename = path.basename(filePath);
    const license_no = path.parse(filename).name; 

    await fileQueue.add(
      'register-file',
      {
        filepath: filePath,
        filename,
        filesize: stats.size,
        license_no
      },
      {
        jobId: filePath
      }
    );

    console.log(`📬 Job queued: ${filename} (reg_no: ${license_no})`);
  } catch (err) {
    console.error('Watcher error:', err.message);
  }
});
