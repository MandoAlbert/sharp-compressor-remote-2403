const env = {
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
};

const directories = {
  source: 'source',
  output: 'output',
};

const AppConst = {
  environments: {
    development: 'development',
    production: 'production'
  },
  port: env.port,
  baseUrl: env.baseUrl,
  sourceDir: `./public/${directories.source}`,
  outputDir: `./public/${directories.output}`,
  sourceBase: `${env.baseUrl}/${directories.source}`,
  outputBase: `${env.baseUrl}/${directories.output}`,
  resultFormats: {
    detailed: 'detailed',
    imageUrl: 'imageUrl',
  }
};

export default AppConst;
