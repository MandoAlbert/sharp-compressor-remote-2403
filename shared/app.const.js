// TODO: MOVE TO .env
const port = 3000;
const baseUrl = `http://localhost:${port}`;

const AppConst = {
  port: port,
  downloadsDir: './public/downloads',
  outputDir: './public/output',
  baseUrl: baseUrl,
  outputBase: `${baseUrl}/output`,
  downloadsBase: `${baseUrl}/downloads`,
};

export default AppConst;
