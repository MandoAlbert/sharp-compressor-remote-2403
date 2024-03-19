// TODO: MOVE TO .env
const port = 3000;
// const baseUrl = `http://localhost:${port}`; // Local
const baseUrl = `https://sharp-compressor-remote-2403.onrender.com`; // render.com

const AppConst = {
  port: port,
  downloadsDir: './public/downloads',
  outputDir: './public/output',
  baseUrl: baseUrl,
  outputBase: `${baseUrl}/output`,
  downloadsBase: `${baseUrl}/downloads`,
};

export default AppConst;
