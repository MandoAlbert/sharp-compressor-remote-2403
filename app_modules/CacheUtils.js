import fs from 'fs';

const cache = {};

export default class CacheUtils {
  static getCache(url) {
    if (cache[url]) {
      fs.existsSync(cache[url]);
      return cache[url];
    }
    return null;
  }

  static setCache(url, path) {
    cache[url] = path;
  }
}