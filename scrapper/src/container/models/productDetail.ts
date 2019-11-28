import { MySQLModel } from './mysql';

export interface ProductDetail {
  id: string;
  productId: string;
  detailId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductDetailModel extends MySQLModel<ProductDetail> {
  getTableName(): string {
    return 'productDetail';
  }
}
