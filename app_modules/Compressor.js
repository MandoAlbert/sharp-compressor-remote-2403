import DownloadUtils from './DownloadUtils.js';
import IOUtils from './IOUtils.js';
import ImageUtils from './ImageUtils.js';
import AppUtils from './AppUtils.js';
import AppConst from '../shared/app.const.js'

export default class Compressor {
  static async compressRemote(url, quality = 90, itemPrefix = '', namingTemplate = '') {
    const targetFiles = [];

    // Prepare download directory
    if (!IOUtils.createFolder(AppConst.downloadsDir)) {
      IOUtils.logError(`>> Could not create the downloads folder ${AppConst.downloadsDir}`);
      // console.error(`>> Could not create the downloads folder ${AppConst.downloadsDir}`);
      return;
    }

    // Download image
    const fileExt = IOUtils.getExtension(url);
    const filename = `img_${new Date().getTime()}.${fileExt}`;

    try {
      console.log(`>> Downloading: ${filename}`);
      await DownloadUtils.downloadFile(url, `${AppConst.downloadsDir}/${filename}`);

      // List downloaded image
      targetFiles.push(filename);
    } catch (error) {
      IOUtils.logError(error.stack, `>> Error while downloading, url: ${filename}`)
      // console.error(`>> Error while downloading ${filename}`);
    }

    if (!targetFiles.length) {
      // console.error(`>> Could not target any images!`);
      return;
    }

    // Prepare output directory
    if (!IOUtils.createFolder(AppConst.outputDir)) {
      IOUtils.logError(`>> Could not create the output folder ${AppConst.outputDir}`);
      // console.error(`>> Could not create the output folder ${AppConst.outputDir}`);
      return;
    }

    // Process target files
    const results = await this.#processFiles(
      targetFiles,
      AppConst.downloadsDir,
      AppConst.outputDir,
      quality,
      itemPrefix,
      namingTemplate
    );

    // Publish results
    this.#publishResults(results);

    return results;
  }

  static async compressAll(inputPath, outputPath, sourceExt, quality = 90, itemPrefix = '', namingTemplate = '') {
    // Get target files
    const targetFiles = this.#listTargetFiles(inputPath, sourceExt);
    if (!targetFiles) return;

    // Prepare output directory
    const created = IOUtils.createFolder(outputPath)
    if (!created) {
      IOUtils.logError(`>> Could not create the output folder ${outputPath}`);
      // console.error(`>> Could not create the output folder ${outputPath}`);
      return;
    }

    // Process target files
    const results = await this.#processFiles(
      targetFiles,
      inputPath,
      outputPath,
      quality,
      itemPrefix,
      namingTemplate
    );

    // Publish results
    this.#publishResults(results);

    return results;
  }

  static #listTargetFiles(inputPath, sourceExt) {
    // List all files
    const filesList = IOUtils.listFiles(inputPath);
    if (!filesList) {
      IOUtils.logError(`>> Could not list files ${inputPath}`);
      // console.error(`>> Could not list files ${inputPath}`);
      return null;
    }

    // Filter files to get the files with target extensions
    const targetFiles = filesList.filter(file => sourceExt.includes(IOUtils.getExtension(`${inputPath}/${file}`)));
    if (!targetFiles || targetFiles.length == 0) {
      console.info('No files found with the chosen extensions');
      return null;
    }

    return targetFiles;
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
        quality);

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

  static #publishResults(results) {
    const successCount = results.filter(item => item.success).length;
    const failedCount = results.length - successCount;

    const originalSize = results.reduce((acc, item) => acc + item.originalSize, 0);
    const compressSize = results.reduce((acc, item) => acc + item.compressSize, 0);
    const savedSize = originalSize - compressSize;
    const compressRate = Math.round(compressSize / originalSize * 100);

    //console.log(results);
    console.log(`--- Process Done ---`);
    console.log(
      `Total: ${results.length}, `
      + `Success: ${successCount}, `
      + `Failed: ${failedCount}`);
    console.log(
      `Size before: ${AppUtils.formatSize(originalSize)}, `
      + `Size after: ${AppUtils.formatSize(compressSize)}, `
    );
    console.log(
      `Saved: ${AppUtils.formatSize(savedSize)}, `
      + `Compress Rate: ${compressRate}%`
    );
  }
}
