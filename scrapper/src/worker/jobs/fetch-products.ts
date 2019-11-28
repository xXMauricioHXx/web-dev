import { Cron } from './cron';
import { ProductService } from '../../container/services/product';
import { logger } from '../../logger';
import { Container } from '../../container';

export class FetchProductsJob extends Cron {
  protected productService: ProductService;

  constructor(container: Container) {
    // super('0 */2 * * *');
    super('*/60 * * * * *');
    this.productService = container.productService;
  }

  protected async handler(): Promise<void> {
    const fetchedProducts = await this.productService.sync();
    logger.info('Fetched products from Época Cosméticos and Beleza na Web', {
      usersCount: fetchedProducts.length,
    });
  }

  protected async errorHandler(err: Error): Promise<void> {
    super.errorHandler(err);
    logger.warn('Error to fetch products', { message: err.message });
  }
}
