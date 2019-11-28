import { MySQLModel } from './mysql';

export interface ProductUpdate {
  id: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductUpdateModel extends MySQLModel<ProductUpdate> {
  getTableName(): string {
    return 'productToUpdate';
  }
}
