import { MySQLModel } from './mysql';
import { Transaction } from 'knex';

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductModel extends MySQLModel<Product> {
  getTableName(): string {
    return 'product';
  }

  async getByName(name: string, trx?: Transaction): Promise<boolean> {
    const result = await this.transactionable(trx).where('name', name);
    return result.length > 0;
  }
}
