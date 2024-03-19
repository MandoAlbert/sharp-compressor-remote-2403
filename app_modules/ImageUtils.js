import sharp from 'sharp';
import IOUtils from './IOUtils.js';

export default class ImageUtils {
  static async toJPEG(inputPath, outputPath, quality=100) {
    try {
      return await sharp(inputPath)
        .jpeg({ mozjpeg: true, quality: quality })
        .toFile(outputPath);
    } catch (error) {
      IOUtils.logError(error.stack, `Error while processing ${inputPath}`);
      // console.error(error);
    }
    return null;
  }
}
