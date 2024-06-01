import IOUtils from "../app_modules/IOUtils.js";

export default class LogsHandler {
  static readLogs(_req, res) {
    res.send(IOUtils.readErrors());
  }

  static clearLogs(_req, res) {
    const success = IOUtils.clearErrors();
    res.send(
      success
        ? 'Error log had been successfully cleared'
        : 'Error while clearing errors log'
    );
  }
}