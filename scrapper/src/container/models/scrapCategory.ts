import { MySQLModel } from './mysql';
import { Transaction } from 'knex';

export interface ScrapCategory {
  id: string;
  categoryId: string;
  scrapId: string;
  start: number;
  end: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateStartAndEndByScrapIdAndCategoryIdDTO {
  start: number;
  end: number;
  categoryId: string;
  scrapId: string;
}

export class ScrapCategoryModel extends MySQLModel<ScrapCategory> {
  getTableName(): string {
    return 'scrapCategory';
  }

  async updateStartAndEndByScrapIdAndCategoryId(
    data: UpdateStartAndEndByScrapIdAndCategoryIdDTO,
    trx?: Transaction
  ): Promise<void> {
    const { start, end, categoryId, scrapId } = data;
    await this.transactionable(trx)
      .update({ start, end })
      .where('categoryId', categoryId)
      .andWhere('scrapId', scrapId);
  }
}
