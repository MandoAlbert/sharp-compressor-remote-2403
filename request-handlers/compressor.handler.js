import Compressor from "../app_modules/Compressor.js";
import IOUtils from "../app_modules/IOUtils.js";
import AppConst from '../shared/app.const.js'
import ValidationUtils from "../app_modules/ValidationUtils.js";
import AppDefaults from '../shared/app.defaults.js';
import AppUtils from "../app_modules/AppUtils.js";
import CleanupUtils from '../app_modules/CleanupUtils.js';

export default class CompressorHandler {
  static async compress(req, res) {
    const { values, error } = CompressorHandler.getValidInput(req);

    if (error) {
      return res.json({ error });
    }

    let response;
    let results;
    const { url, quality, prefix, resultFormat } = values;

    try {
      results = await Compressor.compressRemote(url, quality, prefix);

      if (resultFormat === AppConst.resultFormats.imageUrl) {
        // Expected one image only. Process can fail and no images found.
        if (results && results.length && results[0].output) {
          response = {
            success: true,
            result: { output: `${AppConst.outputBase}/${results[0].output}` },
          };
        }
      } else {
        // default is `AppConst.resultFormats.detailed`
        response = CompressorHandler.formatDetailedResult(values, results);
      }

      // Schedule a Clean up
      setTimeout(() => {
        if (results && results.length) {
          CleanupUtils.cleanup([
            `${AppConst.sourceDir}/${results[0].source}`,
            `${AppConst.outputDir}/${results[0].output}`,
          ]);
        }
      }, AppDefaults.compressor.timeout * 1000);
    } catch (error) {
      IOUtils.logError(error.stack, "Unexpected error");
      response = { error: "Unexpected error" }
    }

    res.json(response);
  }

  static getValidInput(req) {
    // url [Required]
    const url = req.body.url;

    if (!ValidationUtils.exists(url)) {
      return { error: 'Url is required' }
    }

    if (!ValidationUtils.isValidImageUrl(url, AppDefaults.compressor.allowedExtensions)) {
      return { error: 'Url is invalid, must provide a valid image Url' }
    }

    // Options [Optional]
    let quality = req.body.quality;  // int range[10:100]
    let prefix = req.body.prefix;  // string length[1:10]
    let resultFormat = req.body.resultFormat;  // string [AppConst.resultFormats]

    if (!ValidationUtils.isInteger(quality, 10, 100)) {
      quality = AppDefaults.compressor.quality;
    }

    if (!ValidationUtils.isString(prefix, 1, 10)) {
      prefix = AppDefaults.compressor.prefix;
    }

    if (!ValidationUtils.existsIn(resultFormat, Object.values(AppConst.resultFormats))) {
      resultFormat = AppDefaults.compressor.resultFormat;
    }

    return { values: { url, quality, prefix, resultFormat } }
  }

  static formatDetailedResult(input, results) {
    const { url, quality, prefix } = input;

    const result = results.length && results[0];
    let formattedResult;
    if (result) {
      formattedResult = {
        original: `${AppConst.sourceBase}/${result.source}`,
        output: `${AppConst.outputBase}/${result.output}`,
        success: result.success,
        originalSizeBytes: result.originalSize,
        originalSize: AppUtils.formatSize(result.originalSize),
        outputSizeBytes: result.compressSize,
        outputSize: AppUtils.formatSize(result.compressSize),
        savedBytes: result.sizeDiff,
        saved: AppUtils.formatSize(result.sizeDiff),
        compressRatio: Number((result.compressSize / result.originalSize).toFixed(2)),
      }
    }

    return {
      success: true,
      url: url,
      quality: quality,
      prefix: prefix,
      result: formattedResult,
    };
  }
}
