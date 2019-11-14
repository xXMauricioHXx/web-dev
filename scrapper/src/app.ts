import { HttpServer } from './http';
import { Container } from './container';
import { logger } from './logger';
import { MongoClientOptions, Db, MongoClient } from 'mongodb';

export interface AppConfig {
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
      mongoConfig,
    );

    await mongoConnection.connect();

    const mongoDatabase = mongoConnection.db(this.config.mongoDb);

    await mongoDatabase
      .collection('product')      

    return mongoDatabase;
  }


  async start(): Promise<void> {
    const { httpPort, httpBodyLimit, epocaBaseURL, epocaCepURL, belezaBaseURL } = this.config;

    const mongoDatabase = await this.initMongoDatabase();

    const container = new Container({
      mongoDatabase,
      epocaIntegrationConfig: {
        baseURL: epocaBaseURL,
        freteURL: epocaCepURL,
      },
      belezaIntegrationConfig: {
        baseURL: belezaBaseURL,
      }
    });

    this.httpServer = new HttpServer(container, {
      port: httpPort,
      bodyLimit: httpBodyLimit,
    });

    this.httpServer.start();
    logger.info(`Http server started in port ${this.httpServer.port}`);
  }
}
