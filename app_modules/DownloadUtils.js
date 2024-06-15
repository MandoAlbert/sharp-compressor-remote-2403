import fs from 'fs'
import Https from 'https'

export default class DownloadUtils {
  static async downloadFile(url, dist) {
    return await new Promise((resolve, reject) => {
      Https.get(url, response => {
        const code = response.statusCode ?? 0

        if (code >= 400) {
          return reject(new Error(response.statusMessage))
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return resolve(
            DownloadUtils.downloadFile(response.headers.location, dist)
          )
        }

        // save the file to disk
        const fileWriter = fs
          .createWriteStream(dist)
          .on('finish', () => {
            resolve({})
          })

        response.pipe(fileWriter)
      }).on('error', error => {
        reject(error);
      })
    })
  }
}
