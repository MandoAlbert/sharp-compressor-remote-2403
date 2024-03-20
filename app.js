import 'dotenv/config'
import express from 'express'
import CompressorHandler from './request-handlers/compressor-handler.js';
import AppConst from './shared/app.const.js';
import CleanupUtils from './app_modules/CleanupUtils.js';
import AuthMiddleware from './auth/auth.middleware.js'

const app = express();

// ----- * app use * -----

app.use(express.json());
app.use(express.static('public'));

// ----- * Routes * -----

app.get('/', async (req, res) => {
  res.json({ message: "Hello, Compressor!" });
});

app.post(
  '/compress',
  AuthMiddleware.validateTokenMiddleware,
  CompressorHandler.compress
);

// CREATE PROTECTED ROUTE TO READ AND CLEAR LOGS
// ...

// NotFound
app.use((_, res, next) => {
  if (res.headersSent) {
    return next();
  }

  // No route found, send a 404 response with a message
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
