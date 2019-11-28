import { MySQLModel } from './mysql';
import { Transaction } from 'knex';

export interface Effect {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class EffectModel extends MySQLModel<Effect> {
  getTableName(): string {
    return 'effect';
  }

  async getEffectByName(name: string, trx?: Transaction): Promise<Effect> {
    return await this.transactionable(trx)
      .where('name', name)
      .first();
  }
}
