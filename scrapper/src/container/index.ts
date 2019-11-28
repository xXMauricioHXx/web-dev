import { EpocaIntegration, EpocaIntegrationConfig } from './integrations/epoca';
import { EpocaService } from './services/epoca';
import {
  BelezaIntegration,
  BelezaIntegrationConfig,
} from './integrations/beleza';
import { BelezaService } from './services/beleza';
import knex from 'knex';
import { Db } from 'mongodb';
import { ProductModel } from './models/product';
import { ProductService } from './services/product';
import { ScrapModel } from './models/scrap';
import { DetailModel } from './models/detail';
import { ProductDetailModel } from './models/productDetail';
import { ScrapCategoryModel } from './models/scrapCategory';
import { EffectModel } from './models/effect';
import { ProductEffectModel } from './models/productEffect';
import { PriceHistoryModel } from './models/priceHistory';
import { ProductUpdateModel } from './models/productUpdate';

export interface ServiceContext {
  epocaIntegration: EpocaIntegration;
  belezaIntegration: BelezaIntegration;
  productModel: ProductModel;
  scrapModel: ScrapModel;
  detailModel: DetailModel;
  productDetailModel: ProductDetailModel;
  scrapCategoryModel: ScrapCategoryModel;
  effectModel: EffectModel;
  priceHistoryModel: PriceHistoryModel;
  productEffectModel: ProductEffectModel;
  productUpdate: ProductUpdateModel;
}

export interface ContainerConfig {
  mysqlDatabase: knex;
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
      productUpdate: new ProductUpdateModel(config.mysqlDatabase),
      productModel: new ProductModel(config.mysqlDatabase),
      scrapModel: new ScrapModel(config.mysqlDatabase),
      detailModel: new DetailModel(config.mysqlDatabase),
      productDetailModel: new ProductDetailModel(config.mysqlDatabase),
      scrapCategoryModel: new ScrapCategoryModel(config.mysqlDatabase),
      effectModel: new EffectModel(config.mysqlDatabase),
      productEffectModel: new ProductEffectModel(config.mysqlDatabase),
      priceHistoryModel: new PriceHistoryModel(config.mysqlDatabase),
      epocaIntegration: new EpocaIntegration(config.epocaIntegrationConfig),
      belezaIntegration: new BelezaIntegration(config.belezaIntegrationConfig),
    };

    this.epocaService = new EpocaService(serviceContext);
    this.belezaService = new BelezaService(serviceContext);
    this.productService = new ProductService(serviceContext);
  }
}
