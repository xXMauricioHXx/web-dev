import { Cron } from './cron';
import { ProductService } from '../../container/services/product';
import { logger } from '../../logger';
import { Container } from '../../container';

export class UpdatePriceJob extends Cron {
  protected productService: ProductService;

  constructor(container: Container) {
    super('*/60 * * * * *');
    this.productService = container.productService;
  }

  protected async handler(): Promise<void> {
    await this.productService.updatePrice();
    logger.info('Updating from Época Cosméticos and Beleza na Web');
  }

  protected async errorHandler(err: Error): Promise<void> {
    super.errorHandler(err);
    logger.warn('Época Cosméticos and Beleza na Web');
  }
}
