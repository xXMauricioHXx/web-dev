import { MySQLModel } from './mysql';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  cep: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel extends MySQLModel<User> {
  getTableName(): string {
    return 'scrap';
  }
}
