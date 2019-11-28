import { MySQLModel } from './mysql';

export interface ProductEffect {
  id: string;
  productId: string;
  effectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductEffectModel extends MySQLModel<ProductEffect> {
  getTableName(): string {
    return 'productToUpdate';
  }
}
