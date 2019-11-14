import { ProductBrands } from "../../enums";

export interface ProductResponse {
  itemId: string;
  image: string;
  name: string;
  price: string;
  oldPrice: string;
  description: string;
  installments?: number;
  installmentsPrice?: string;
  brand: string,  
  siteImage: string;
  siteLink: string;
  category: string;
  shippingPrice?: string;
  priceWithShipping?: string;
  complete?: boolean;
  brandName: ProductBrands;
}
