import fs from 'fs';
import AppConst from '../shared/app.const.js';
import path from 'path';

export default class IOUtils {
  static listFiles(path) {
    if (!path || path.length == 0 || !fs.existsSync(path)) return null;

    try {
      return fs.readdirSync(path);
    } catch (error) {
      IOUtils.logError(error.stack, `Error while listing dir ${path}`);
    }
    return null;
  }

  static getExtension(path) {
    const dotIndex = path.lastIndexOf('.');
    if (dotIndex < 0) return null;
    return path.substring(dotIndex + 1, path.length);
  }

  static getFileInfo(path, file) {
    const dotIndex = file.lastIndexOf('.');
    if (dotIndex < 0) return null;
    const extension = file.substring(dotIndex + 1, file.length);
    const filename = file.substring(0, dotIndex);

    const { size } = fs.statSync(path + '/' + file);

    return { filename, extension, size }
  }

  static createFolder(path) {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      return true;
    } catch (error) {
      IOUtils.logError(error.stack, `Error while creating new dir ${path}`);
    }
    return false;
  }

  static clearDir(path) {
    if (!path) return 0;

    let counter = 0;
    const files = this.listFiles(path);

    if (files) {
      files.forEach(file => {
        const filePath = `${path}/${file}`;
        console.log(`>> Deleting: ${filePath}`);
        try {
          fs.rmSync(filePath);
          counter++;
        } catch (error) {
          IOUtils.logError(error.stack, `Error while deleting ${filePath}`);
        }
      });
    }

    return counter;
  }

  static deleteFile(filePath) {
    if (!filePath || !fs.existsSync(filePath)) return false;

    try {
      fs.rmSync(filePath);
      return true;
    } catch (error) {
      IOUtils.logError(error.stack, `Error while deleting ${filePath}`);
    }
    return false;
  }

  static logError(error, description = '') {
    if (!this.createFolder('./logs')) {
      return;
    }

    const errorFile = path.join(AppConst.files.errorsLogPath, AppConst.files.errorsLogFile);
    const logStream = fs.createWriteStream(errorFile, { flags: 'a' });
    logStream.write(`${description}\n${error}\n\n-----\n\n`);
    logStream.end();
  }

  static readErrors() {
    const errorFile = path.join(AppConst.files.errorsLogPath, AppConst.files.errorsLogFile);
    if (fs.existsSync(errorFile)) {
      return fs.readFileSync(errorFile);
    }
    return '';
  }

  static clearErrors() {
    const errorFile = path.join(AppConst.files.errorsLogPath, AppConst.files.errorsLogFile);
    if (fs.existsSync(errorFile)) {
      try {
        fs.writeFileSync(errorFile, '');
        return true;
      } catch (error) {
        IOUtils.logError(error.stack, `Error while clearing error logs ${errorFile}`);
      }
    }
    return false;
  }
}
