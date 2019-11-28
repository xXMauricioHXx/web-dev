import { MySQLModel } from './mysql';

export interface Saller {
  id: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SallerModel extends MySQLModel<Saller> {
  getTableName(): string {
    return 'saller';
  }
}
