import { MySQLModel } from './mysql';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryModel extends MySQLModel<Category> {
  getTableName(): string {
    return 'category';
  }
}
