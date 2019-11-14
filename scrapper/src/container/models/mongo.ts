import { Db, Collection, ObjectID } from 'mongodb';
import { Product } from './product';

export abstract class MongoModel<T> {
  protected readonly database: Db;
  protected abstract getCollectionName(): string;

  constructor(database: Db) {
    this.database = database;
  }

  protected get collection(): Collection {
    return this.database.collection(this.getCollectionName());
  }

  async getByObjectId(id: string): Promise<T | null> {
    return await this.collection.findOne<T>({ _id: new ObjectID(id) });
  }

  async getAll(): Promise<T[]> {
    return await this.collection.find<T>().toArray();
  }

  async insertMany(data: Object[]): Promise<void> {
    await this.collection.insertMany(data);
  }

  async insert(data: Object): Promise<void> {
    await this.collection.insert(data);
  }

  async deleteAll(): Promise<void> {
    await this.collection.deleteMany({});
  }

  async updateById(id: string, data: Object): Promise<void> {
    await this.collection.findOneAndUpdate({_id: new ObjectID(id)}, data);
  }
}
