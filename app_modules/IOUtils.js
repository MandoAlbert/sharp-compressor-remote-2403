import { readdirSync, mkdirSync, existsSync, statSync, createWriteStream, rmSync } from 'fs';

export default class IOUtils {
  static listFiles(path) {
    if (!path || path.length == 0 || !existsSync(path)) return null;

    try {
      return readdirSync(path);
    } catch (error) {
      IOUtils.logError(error.stack, `Error while listing dir ${path}`);
      // console.error(error.message);
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

    const { size } = statSync(path + '/' + file);

    return { filename, extension, size }
  }

  static createFolder(path) {
    try {
      if (!existsSync(path)) {
        mkdirSync(path);
      }
      return true;
    } catch (error) {
      IOUtils.logError(error.stack, `Error while creating new dir ${path}`);
      // console.error(error);
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
          rmSync(filePath);
          counter++;
        } catch (error) {
          IOUtils.logError(error.stack, `Error while deleting ${filePath}`);
          // console.error(error);
        }
      });
    }

    return counter;
  }

  static deleteFile(filePath) {
    if (!filePath || !existsSync(path)) return false;

    try {
      rmSync(filePath);
      return true;
    } catch (error) {
      IOUtils.logError(error.stack, `Error while deleting ${filePath}`);
      // console.error(error);
    }
    return false;
  }

  static logError(error, description = '') {
    if (!this.createFolder('./logs')) {
      return;
    }

    const logStream = createWriteStream('./logs/errors.txt', { flags: 'a' });
    logStream.write(`${description}\n${error}\n\n-----\n\n`);
    logStream.end();
  }
}
