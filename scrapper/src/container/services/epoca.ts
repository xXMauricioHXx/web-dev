import { EpocaIntegration } from '../integrations/epoca';
import { ServiceContext } from '..';
import { ProductResponse } from '../integrations/product';
import { ProductModel } from '../models/product';

export class EpocaService {
  protected readonly epocaIntegration: EpocaIntegration;
  protected readonly productModel: ProductModel;

  constructor(context: ServiceContext) {
    this.epocaIntegration = context.epocaIntegration;
    this.productModel = context.productModel;
  }

  async getProducts(productName: string, cep: string): Promise<ProductResponse[]> {    
    return await this.epocaIntegration.getProductsWithShippingPrice(
      productName,
      cep
    );        
  }
}
