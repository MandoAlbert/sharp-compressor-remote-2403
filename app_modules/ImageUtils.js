import sharp from 'sharp';
import IOUtils from './IOUtils.js';

export default class ImageUtils {
  static async toJPEG(inputPath, outputPath, quality = 90, maxDim = 6000) {
    try {
      return await sharp(inputPath)
        .jpeg({ mozjpeg: true, quality: quality })
        .resize({
          width: maxDim,
          height: maxDim,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toFile(outputPath);
    } catch (error) {
      IOUtils.logError(error.stack, `Error while processing ${inputPath}`);
    }
    return null;
  }
}
