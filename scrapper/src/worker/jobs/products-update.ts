import { Cron } from './cron';
import { ProductService } from '../../container/services/product';
import { logger } from '../../logger';
import { Container } from '../../container';

export class ProductUpdateJob extends Cron {
  protected productService: ProductService;

  constructor(container: Container) {
    // super('*0 */2 * * *');
    super('*/60 * * * * *');
    this.productService = container.productService;
  }

  protected async handler(): Promise<void> {
    await this.productService.createProductsToUpdate();
    logger.info('Inserting products to updated data');
  }

  protected async errorHandler(err: Error): Promise<void> {
    super.errorHandler(err);
    logger.warn('Error on insert product', { message: err.message });
  }
}
