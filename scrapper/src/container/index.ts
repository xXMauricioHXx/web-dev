import { EpocaIntegration, EpocaIntegrationConfig } from './integrations/epoca';
import { EpocaService } from './services/epoca';
import {
  BelezaIntegration,
  BelezaIntegrationConfig,
} from './integrations/beleza';
import { BelezaService } from './services/beleza';
import { Db } from 'mongodb';
import { ProductModel } from './models/product';
import { ProductService } from './services/product';

export interface ServiceContext {
  epocaIntegration: EpocaIntegration;
  belezaIntegration: BelezaIntegration;
  productModel: ProductModel;
}

export interface ContainerConfig {
  mongoDatabase: Db;
  epocaIntegrationConfig: EpocaIntegrationConfig;
  belezaIntegrationConfig: BelezaIntegrationConfig;
}

export class Container {
  readonly epocaService: EpocaService;
  readonly belezaService: BelezaService;
  readonly productService: ProductService;

  constructor(config: ContainerConfig) {
    const serviceContext: ServiceContext = {
      productModel: new ProductModel(config.mongoDatabase),
      epocaIntegration: new EpocaIntegration(config.epocaIntegrationConfig),
      belezaIntegration: new BelezaIntegration(config.belezaIntegrationConfig),
    };

    this.epocaService = new EpocaService(serviceContext);
    this.belezaService = new BelezaService(serviceContext);
    this.productService = new ProductService(serviceContext);
  }
}
