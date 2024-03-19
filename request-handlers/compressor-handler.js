import Compressor from "../app_modules/Compressor.js";
import IOUtils from "../app_modules/IOUtils.js";
import AppConst from '../shared/app.const.js'

export default class CompressorHandler {
  static async compress(req, res) {
    // Input
    const inputUrl = req.body.url;

    // Options
    const targetQuality = req.body.quality || 80;
    const itemPrefix = req.body.itemPrefix || '';
    const namingTemplate = req.body.namingTemplate || '';

    // TODO: Validate all data with there types
    if (!inputUrl) {
      res.json({ error: 'Url is required' });
    }

    let response;

    try {
      const results = await Compressor.compressRemote(
        inputUrl,
        targetQuality,
        itemPrefix,
        namingTemplate
      );
      const formattedResults = results.map(item => ({
        original: `${AppConst.downloadsBase}/${item.source}`,
        output: `${AppConst.outputBase}/${item.output}`,
        success: item.success,
        originalSize: item.originalSize,
        outputSize: item.compressSize,
        saved: item.sizeDiff,
      }));

      response = {
        url: inputUrl,
        quality: targetQuality,
        itemPrefix: itemPrefix || 'None',
        namingTemplate: namingTemplate || 'Default: as input',
        results: formattedResults,
      };
    } catch (error) {
      IOUtils.logError(error.stack, "Unexpected error");
      response = { error: "Unexpected error" }
    }

    setTimeout(() => {
      const dirs = [AppConst.downloadsDir, AppConst.outputDir];
      for (const dir of dirs) {
        console.log(`----- * Start Cleaning ${dir} * -----`);
        const count = IOUtils.clearDir(dir);
        console.log(`----- * End Cleaning, removed: ${count} * -----`);
      }
    }, 1000);

    res.json(response);
  }
}
