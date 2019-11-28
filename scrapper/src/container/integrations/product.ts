export interface ProductResponse {
  itemId: string;
  imageUrl: string;
  name: string;
  price: number;
  oldPrice: number;
  description: string;
  installments?: number;
  installmentsPrice?: number;
  link: string;
  shippingPrice?: string;
  priceWithShipping?: number;
  brand: string;
}
