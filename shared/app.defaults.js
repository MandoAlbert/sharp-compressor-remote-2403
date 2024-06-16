import AppConst from "./app.const.js";

const AppDefaults = {
  compressor: {
    quality: 90,
    maxDim: 6000,
    prefix: '',
    filename: '',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    timeout: 180, // In seconds
    resultFormat: AppConst.resultFormats.detailed,
  }
};

export default AppDefaults;
