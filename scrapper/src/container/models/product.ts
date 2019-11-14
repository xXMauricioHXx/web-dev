import { MongoModel } from "./mongo";

export interface Product {
  _id: string;
  name: string;
  companies: [
    {
      itemId: string,
      price: string;
      oldPrice: string;
      description: string;
      installments?: number;
      installmentsPrice?: string;
      brand: string,
      image: string;
      siteImage: string;
      siteLink: string;
      shippingPrice?: string;
      priceWithShipping?: string;
    }
  ]
}

export class ProductModel extends MongoModel<Product> {
  protected getCollectionName(): string {
    return 'product';
  }

}
