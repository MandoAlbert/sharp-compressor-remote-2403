import sharp from 'sharp';
import IOUtils from './IOUtils.js';

const MAX_PENDING_IMAGES = 1;
const pendingQueue = [];
const processingItems = new Set();

sharp.concurrency(1);
sharp.cache(false);

export default class ImageUtils {
  static async toJPEG(inputPath, outputPath, quality = 90, maxDim = 6000) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({ inputPath, outputPath, quality, maxDim, resolve, reject });
      this.processQueue();
    });
  }

  static async processQueue() {
    if (pendingQueue.length === 0 || processingItems.size >= MAX_PENDING_IMAGES) {
      // Queue is empty or full
      return;
    }

    // Get the next item
    const currentItem = pendingQueue.shift();

    // Add current item
    processingItems.add(currentItem);

    const { inputPath, outputPath, quality, maxDim, resolve, reject } = currentItem;

    try {
      const info = await sharp(inputPath)
        .jpeg({ mozjpeg: true, quality: quality })
        .resize({
          width: maxDim,
          height: maxDim,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFile(outputPath);

      resolve(info);
    } catch (error) {
      IOUtils.logError(error.stack, `Error while processing ${inputPath}`);
      reject(error);
    } finally {
      // Remove current item
      processingItems.delete(currentItem);

      // Recursively process the next image in the queue
      this.processQueue();
    }
  }
}
