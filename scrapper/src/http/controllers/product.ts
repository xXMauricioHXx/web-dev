import { Container } from '../../container';
import { BaseController } from './controller';
import { EpocaService } from '../../container/services/epoca';
import { Controller, Get } from '../decorators';
import { Request, Response, NextFunction } from 'express';
import { BelezaService } from '../../container/services/beleza';
import { ProductService } from '../../container/services/product';

@Controller('/products')
export class EpocaController extends BaseController {
  protected readonly epocaService: EpocaService;
  protected readonly belezaService: BelezaService;
  protected readonly productService: ProductService;

  constructor(container: Container) {
    super();
    this.epocaService = container.epocaService;
    this.belezaService = container.belezaService;
    this.productService = container.productService;
  }
  @Get('/')
  async check(req: Request, res: Response, next: NextFunction) {
    await this.productService.getProductBySKU('7899706116336');
    res.sendStatus(204);
  }
}
