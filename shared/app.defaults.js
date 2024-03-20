import AppConst from "./app.const.js";

const AppDefaults = {
  compressor: {
    quality: 80,
    prefix: '',
    filename: '',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    timeout: 30000, // 30 seconds
    resultFormat: AppConst.resultFormats.detailed,
  }
};

export default AppDefaults;
