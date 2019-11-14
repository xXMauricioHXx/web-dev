import { ServiceContext } from '..';
import { BelezaIntegration } from '../integrations/beleza';
import { ProductResponse } from '../integrations/product';

export class BelezaService {
  protected readonly belezaIntegration: BelezaIntegration;

  constructor(context: ServiceContext) {
    this.belezaIntegration = context.belezaIntegration;
  }

  async getProdutcs(productName: string, cep: string): Promise<any> {
    return await this.belezaIntegration.getProductsWithShippingPrice(
      productName,
      cep,
    );
  }
}
