import { MySQLModel } from './mysql';
import { Transaction } from 'knex';

export interface Detail {
  id: string;
  externalId: string;
  price: number;
  oldPrice: number;
  description: string;
  installments: number;
  imageUrl: string;
  shippingPrice: string;
  link: string;
  sallerId: string;
  sku?: string;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DetailModel extends MySQLModel<Detail> {
  getTableName(): string {
    return 'detail';
  }

  async getDetailByProductId(
    productId: string,
    trx?: Transaction
  ): Promise<Detail[]> {
    return await this.transactionable(trx)
      .from('productDetail')
      .innerJoin('detail', 'productDetail.detailId', 'detail.id')
      .where('productDetail.productId', productId);
  }

  async updatePriceByDetailId(
    price: number,
    id: string,
    trx?: Transaction
  ): Promise<void> {
    await this.transactionable(trx)
      .update({ price })
      .where('id', id);
  }
  async updateOldPriceByDetailId(
    oldPrice: number,
    id: string,
    trx?: Transaction
  ): Promise<void> {
    await this.transactionable(trx)
      .update({ oldPrice })
      .where('id', id);
  }
}
