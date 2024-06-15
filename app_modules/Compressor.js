import DownloadUtils from './DownloadUtils.js';
import IOUtils from './IOUtils.js';
import ImageUtils from './ImageUtils.js';
import AppConst from '../shared/app.const.js'
import CacheUtils from './CacheUtils.js';
import AppDefaults from '../shared/app.defaults.js';

export default class Compressor {
  static async compressRemote(url, quality, itemPrefix = '', namingTemplate = '') {
    // Prepare download directory
    if (!IOUtils.createFolder(AppConst.sourceDir)) {
      IOUtils.logError(`>> Could not create the source folder ${AppConst.sourceDir}`);
      return;
    }

    const targetFiles = [];

    // Check if image is in cache
    let filename = CacheUtils.getCache(url);

    if (filename) {
      targetFiles.push(filename);
    } else {
      // Download image
      let ext = IOUtils.getExtension(url);
      if (!AppDefaults.compressor.allowedExtensions.includes(ext)) {
        ext = 'jpg';
      }
      const filename = `img_${new Date().getTime()}.${ext}`;
      try {
        await DownloadUtils.downloadFile(url, `${AppConst.sourceDir}/${filename}`);
        CacheUtils.setCache(url, filename);
        targetFiles.push(filename);
      } catch (error) {
        IOUtils.logError(error.stack, `>> Error while downloading, url: ${filename}`);
      }
    }

    if (!targetFiles.length) {
      console.log('No target files to process');
      return;
    }

    // Prepare output directory
    if (!IOUtils.createFolder(AppConst.outputDir)) {
      IOUtils.logError(`>> Could not create the output folder ${AppConst.outputDir}`);
      return;
    }

    // Process target files
    const results = await this.#processFiles(
      targetFiles,
      AppConst.sourceDir,
      AppConst.outputDir,
      quality || AppDefaults.compressor.quality,
      `${itemPrefix}_${quality}_`,
      namingTemplate,
    );

    return results;
  }

  static async #processFiles(targetFiles, inputPath, outputPath, quality, itemPrefix, namingTemplate) {
    const results = [];
    const totalCount = targetFiles.length;

    for (let i = 0; i < totalCount; i++) {
      const file = targetFiles[i];
      const image = IOUtils.getFileInfo(inputPath, file);

      const inputFile = `${file}`;
      const outputFile = `${itemPrefix}${namingTemplate ? namingTemplate + (i + 1) : image.filename}.jpg`;

      console.log(`>> [${i + 1}/${totalCount}] Processing: ${inputFile}`);

      const info = await ImageUtils.toJPEG(
        `${inputPath}/${inputFile}`,
        `${outputPath}/${outputFile}`,
        quality,
        AppDefaults.compressor.maxDim,
      );

      results.push({
        source: inputFile,
        output: outputFile,
        success: info != null,
        originalSize: image.size,
        compressSize: info.size || image.size,
        sizeDiff: image.size - info.size,
      });
    }

    return results;
  }
}
