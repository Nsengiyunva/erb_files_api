import chokidar from 'chokidar';
import fs from 'fs/promises';
import path from 'path';
import { fileQueue } from './file_queue.js';

// const WATCH_DIR = '/var/ugpass/destination';
const WATCH_DIR = '/home/user1/ERB/uploads';

console.log(`👀 Watching ${WATCH_DIR}`);

const watcher = chokidar.watch(WATCH_DIR, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});

watcher.on('add', async filePath => {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) return;

    await fileQueue.add(
      'register-file',
      {
        filepath: filePath,
        filename: path.basename(filePath),
        filesize: stats.size
      },
      {
        jobId: filePath // 🔑 prevents duplicate jobs on PM2 restarts
      }
    );

    console.log(`📬 Job queued: ${path.basename(filePath)}`);
  } catch (err) {
    console.error('Watcher error:', err.message);
  }
});
