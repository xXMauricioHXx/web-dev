import knex from 'knex';
import { HttpServer } from './http';
import { Container } from './container';
import { logger } from './logger';
import { Worker } from './worker';
import { MongoClientOptions, Db, MongoClient } from 'mongodb';

export interface AppConfig {
  knexConfig: knex.Config;
  httpPort: number;
  httpBodyLimit: string;
  epocaBaseURL: string;
  epocaCepURL: string;
  belezaBaseURL: string;
  mongoUser?: string;
  mongoPassword?: string;
  mongoUri: string;
  mongoDb: string;
}

export class Application {
  protected readonly config: AppConfig;
  protected worker?: Worker;
  protected httpServer?: HttpServer;

  constructor(config: AppConfig) {
    this.config = config;
  }

  protected async initMongoDatabase(): Promise<Db> {
    const mongoConfig: MongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    if (this.config.mongoUser && this.config.mongoPassword) {
      mongoConfig.auth = {
        user: this.config.mongoUser,
        password: this.config.mongoPassword,
      };
    }

    const mongoConnection = await new MongoClient(
      this.config.mongoUri,
      mongoConfig
    );

    await mongoConnection.connect();

    const mongoDatabase = mongoConnection.db(this.config.mongoDb);

    await mongoDatabase.collection('product');

    return mongoDatabase;
  }

  async start(): Promise<void> {
    const {
      knexConfig,
      httpPort,
      httpBodyLimit,
      epocaBaseURL,
      epocaCepURL,
      belezaBaseURL,
    } = this.config;

    const mongoDatabase = await this.initMongoDatabase();
    const mysqlDatabase = knex(knexConfig);

    const container = new Container({
      mongoDatabase,
      mysqlDatabase,
      epocaIntegrationConfig: {
        baseURL: epocaBaseURL,
        freteURL: epocaCepURL,
      },
      belezaIntegrationConfig: {
        baseURL: belezaBaseURL,
      },
    });

    this.worker = new Worker(container);
    this.worker.start();
    logger.info(`Worker started with ${this.worker.jobsCount} job(s)`);

    this.httpServer = new HttpServer(container, {
      port: httpPort,
      bodyLimit: httpBodyLimit,
    });

    this.httpServer.start();
    logger.info(`Http server started in port ${this.httpServer.port}`);
  }
}
