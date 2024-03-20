import AppConst from "../shared/app.const.js";
import IOUtils from "./IOUtils.js";

export default class CleanupUtils {
  static cleanupAll() {
    const dirs = [AppConst.sourceDir, AppConst.outputDir];
    for (const dir of dirs) {
      console.log(`----- * Start Cleaning ${dir} * -----`);
      const count = IOUtils.clearDir(dir);
      console.log(`----- * End Cleaning, removed: ${count} * -----`);
    }
  }

  static cleanup(files) {
    for (const file of files) {
      console.log(`>> Removing: ${file}`);
      IOUtils.deleteFile(file);
    }
  }
}
