import * as dotenv from 'dotenv';
import { logger } from './logger';
import { Application } from './app';
const knexfile = require('../knexfile');

dotenv.config();

const application = new Application({
  httpPort:
    (process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT, 10)) || 3000,
  httpBodyLimit: process.env.HTTP_BODY_LIMIT || '10kb',
  epocaBaseURL: process.env.EPOCA_BASE_URL || '',
  epocaCepURL: process.env.EPOCA_CEP_URL || '',
  belezaBaseURL: process.env.BELEZA_BASE_URL || '',
  mongoDb: process.env.MONGO_DB || 'makompare',
  mongoPassword: process.env.MONGO_PASSWORD || '',
  mongoUser: process.env.MONGO_USER || '',
  mongoUri: process.env.MONGO_URI || '',
  knexConfig: knexfile,
});

setImmediate(async () => {
  await application.start();
  logger.info('Application started');
});
