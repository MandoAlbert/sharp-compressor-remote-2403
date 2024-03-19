import express from 'express'
import CompressorHandler from './request-handlers/compressor-handler.js';
import AppConst from './shared/app.const.js';

const app = express();

// ----- * app use * -----

app.use(express.json())
app.use(express.static('public'));

// ----- * Routes * -----

app.get('/', async (req, res) => {
  res.json({ message: "Hello, Compressor!" });
});

app.post('/compress', CompressorHandler.compress);


app.listen(AppConst.port, () => {
  console.log(`Example app listening on port ${AppConst.port}`)
  console.log(`Navigate to home: ${AppConst.baseUrl}`)
});
