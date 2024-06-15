import 'dotenv/config'
import express from 'express'
import CompressorHandler from './request-handlers/compressor.handler.js';
import AppConst from './shared/app.const.js';
import CleanupUtils from './app_modules/CleanupUtils.js';
import AuthMiddleware from './auth/auth.middleware.js'
import LogsHandler from './request-handlers/logs.handler.js';

const app = express();

// ----- * app use * -----

app.use(express.json());
app.use(express.static('public'));

// ----- * Routes * -----

app.get('/', async (req, res) => {
  res.json({ message: "Hello, Compressor!" });
});

// --- Protected Route To Compress Image ---
/*
 * Accepts:
 *  url (string) [required]
 *  quality (10:100)
 *  prefix (string)
 *  resultFormat (detailed|imageUrl)
 */
app.post(
  '/process-image',
  AuthMiddleware.validateTokenMiddleware,
  CompressorHandler.compress,
);

// Protected Route To Read Logs
app.post(
  '/read-logs',
  AuthMiddleware.validateTokenMiddleware,
  LogsHandler.readLogs,
);

// Protected Route To Clear Logs
app.post(
  '/clear-logs',
  AuthMiddleware.validateTokenMiddleware,
  LogsHandler.clearLogs,
);

// NotFound
app.use((_, res, next) => {
  if (res.headersSent) {
    return next();
  }

  return res.status(404).send('NotFound');
});

// ----- * Server Start * -----

app.listen(AppConst.port, () => {
  console.log(`Example app listening on port ${AppConst.port}`)
  console.log(`Navigate to home: ${AppConst.baseUrl}`)
});

// ----- * Initializations * -----

if (process.env.ENV === AppConst.environments.production) {
  CleanupUtils.cleanupAll();
}
