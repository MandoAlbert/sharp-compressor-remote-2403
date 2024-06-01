import AppConst from "./app.const.js";

const AppDefaults = {
  compressor: {
    quality: 80,
    prefix: '',
    filename: '',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    timeout: 300, // 5 minutes
    resultFormat: AppConst.resultFormats.detailed,
  }
};

export default AppDefaults;
