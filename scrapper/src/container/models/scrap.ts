import { MySQLModel } from './mysql';

export interface Scrap {
  id: string;
  brandId: string;
  cep: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetScrapCategoryItemResponse {
  cep: string;
  sallerName: string;
  start: number;
  end: number;
  category: string;
  categoryId: string;
  scrapId: string;
  sallerId: string;
}

export class ScrapModel extends MySQLModel<Scrap> {
  getTableName(): string {
    return 'scrap';
  }

  async getScrapCategoryItem(): Promise<GetScrapCategoryItemResponse[]> {
    return await this.database
      .select(
        'scrap.cep',
        'scrap.id as scrapId',
        'saller.name as sallerName',
        'saller.id as sallerId',
        'scrapCategory.start',
        'scrapCategory.end',
        'category.id as categoryId',
        'category.name as category'
      )
      .from('scrap')
      .innerJoin('saller', 'saller.id', 'scrap.sallerId')
      .innerJoin('scrapCategory', 'scrapCategory.scrapId', 'scrap.id')
      .innerJoin('category', 'scrapCategory.categoryId', 'category.id');
  }
}
