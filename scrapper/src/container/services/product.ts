import { Product, ProductModel } from "../models/product";
import { ProductResponse } from "../integrations/product";
import { ServiceContext } from "..";
import { logger } from "../../logger";

export class ProductService {
  protected readonly productModel: ProductModel;

  constructor(context: ServiceContext) {
    this.productModel = context.productModel;
  }

  async sync(productsResponses: Array<ProductResponse[]>): Promise<void> {
    await this.productModel.deleteAll();
    await Promise.all(
      productsResponses.map(async (productResponse, index: number) => {
        const products = await this.productModel.getAll();
        logger.info(`Lendo empresa ${productResponse[index].brandName}`);
        await Promise.all(
          productResponse.map(async (productRps: ProductResponse) => {
            const {
              itemId,
              name,
              price,
              oldPrice,
              description,
              installments,
              installmentsPrice,
              brand,
              image,
              siteImage,
              siteLink,
              shippingPrice,
              priceWithShipping
            } = productRps;

            const companieData = {
              itemId,
              price,
              oldPrice,
              description,
              installments,
              installmentsPrice,
              brand,
              image,
              siteImage,
              siteLink,
              shippingPrice,
              priceWithShipping
            };

            if (products.length) {
              products.forEach(async (product: Product) => {
                if (
                  this.checkPercentName(name, product.name) > 65 &&
                  brand === product.companies[0].brand
                ) {
                  logger.info(
                    `Encontrado 2 produtos iguais: ${name} - ${product.name}`
                  );
                  product.companies.push(companieData);
                  this.productModel.updateById(product._id, product);
                } else {
                  const product = {
                    name,
                    companies: [companieData]
                  };
                  await this.productModel.insert(product);
                }
              });
            } else {
              logger.info(`Salvando produto não encontrado: ${name}`);
              const product = {
                name,
                companies: [companieData]
              };
              await this.productModel.insert(product);
            }
          })
        );
        logger.info("Processo de sync concluido");
      })
    );
  }

  protected checkPercentName(name1: string, name2: string): number {
    const words1 = name1.split(" ");
    const words2 = name2.split(" ");
    let percent = 0;

    if (words1.length > words2.length) {
      const valuePercent = 100 / words1.length;

      words1.forEach((word: string) => {
        if (words2.includes(word)) {
          percent += valuePercent;
        }
      });
    } else {
      const valuePercent = 100 / words2.length;

      words2.forEach((word: string) => {
        if (words1.includes(word)) {
          percent += valuePercent;
        }
      });
    }
    return percent;
  }
}
