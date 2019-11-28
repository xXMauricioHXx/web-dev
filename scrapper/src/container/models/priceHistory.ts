import { MySQLModel } from './mysql';

export interface PriceHistory {
  id: string;
  productId: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PriceHistoryModel extends MySQLModel<PriceHistory> {
  getTableName(): string {
    return 'priceHistory';
  }
}
