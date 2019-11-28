import { Transaction } from 'knex';
import { Product, ProductModel } from '../models/product';
import { ServiceContext } from '..';
import { logger } from '../../logger';
import { EpocaIntegration } from '../integrations/epoca';
import { ScrapModel, GetScrapCategoryItemResponse } from '../models/scrap';
import { ProductBrands } from '../../enums';
import { MongoClient } from 'mongodb';
import { formatCurrencyBRL } from '../../helpers/format-currency';
import { DetailModel } from '../models/detail';
import { ProductDetailModel } from '../models/productDetail';
import { ScrapCategoryModel } from '../models/scrapCategory';
import { EffectModel } from '../models/effect';
import { ProductEffectModel } from '../models/productEffect';
import { PriceHistoryModel } from '../models/priceHistory';
import { ProductUpdateModel } from '../models/productUpdate';
import { BelezaIntegration } from '../integrations/beleza';

export class ProductService {
  protected readonly epocaIntegration: EpocaIntegration;
  protected readonly belezaIntegration: BelezaIntegration;
  protected readonly productModel: ProductModel;
  protected readonly scrapModel: ScrapModel;
  protected readonly detailModel: DetailModel;
  protected readonly productDetail: ProductDetailModel;
  protected readonly scrapCategoryModel: ScrapCategoryModel;
  protected readonly effectModel: EffectModel;
  protected readonly productEffectModel: ProductEffectModel;
  protected readonly priceHistoryModel: PriceHistoryModel;
  protected readonly productUpdateModel: ProductUpdateModel;

  constructor(context: ServiceContext) {
    this.productModel = context.productModel;
    this.epocaIntegration = context.epocaIntegration;
    this.belezaIntegration = context.belezaIntegration;
    this.scrapModel = context.scrapModel;
    this.detailModel = context.detailModel;
    this.productDetail = context.productDetailModel;
    this.effectModel = context.effectModel;
    this.scrapCategoryModel = context.scrapCategoryModel;
    this.productEffectModel = context.productEffectModel;
    this.priceHistoryModel = context.priceHistoryModel;
    this.productUpdateModel = context.productUpdate;
  }

  async sync(): Promise<Product[]> {
    const scrapper = await this.scrapModel.getScrapCategoryItem();
    await Promise.all([
      scrapper.map(async (scrap: GetScrapCategoryItemResponse) => {
        logger.info('Find scrap ', scrap.sallerName);
        if (scrap.sallerName === ProductBrands.Epoca) {
          await this.readEpocaProducts(scrap);
          await this.readBelezaProducts();
        }
      }),
    ]);
    return this.productModel.all();
  }

  async getProductBySKU(sku: string) {
    await this.belezaIntegration.getProductsWithShippingPrice(sku, '');
  }

  protected async readBelezaProducts() {
    const products = await this.productModel.all();
    await Promise.all(
      products.map(async (product) => {
        const details = await this.detailModel.getDetailByProductId(product.id);
        details.map(async (detail) => {
          // this.belezaIntegration.getProductsWithShippingPrice() detail.sku
        });
      })
    );
  }

  protected async readEpocaProducts(scrap: GetScrapCategoryItemResponse) {
    try {
      const {
        category,
        start,
        end,
        cep,
        categoryId,
        sallerId,
        scrapId,
      } = scrap;
      logger.info(
        `Search product : ${category} - START(${start}) - END(${end})`
      );

      const products = await this.epocaIntegration.getProductsWithShippingPrice(
        category,
        cep,
        start,
        end
      );

      logger.info(`Find ${products.length} products (${category})`);
      await Promise.all([
        products.map(async (product) => {
          const exist = await this.productModel.getByName(product.name);
          if (!exist) {
            const productId = await this.productModel.create({
              categoryId,
              name: product.name,
            });

            const detailId = await this.detailModel.create({
              sallerId,
              externalId: product.itemId,
              price: product.price,
              oldPrice: product.oldPrice,
              description: product.description,
              installments: product.installments,
              imageUrl: product.imageUrl,
              link: product.link,
              shippingPrice: product.shippingPrice,
              brand: product.brand,
            });

            await this.productDetail.create({
              productId,
              detailId,
            });
          }
        }),
      ]);

      await this.scrapCategoryModel.updateStartAndEndByScrapIdAndCategoryId({
        categoryId,
        scrapId,
        start: start + 24,
        end: end + 24,
      });
    } catch (err) {
      logger.error('Error to scrap - ', err.message);
    }
  }
  async createProductsToUpdate() {
    const products = await this.productModel.all();
    await Promise.all(
      products.map(async (product) => {
        await this.productUpdateModel.create({
          productId: product.id,
        });
      })
    );
  }

  async updatePrice(): Promise<void> {
    const products = await this.productUpdateModel.all();
    if (products.length) {
      await Promise.all([
        products.map(async ({ id, productId }) => {
          try {
            const details = await this.detailModel.getDetailByProductId(
              productId
            );
            details.map(async (detail) => {
              if (detail.sallerId === '1') {
                logger.info(`Checking item price with id #${productId}`);

                const {
                  effects,
                  price,
                  oldPrice,
                  sku,
                } = await this.epocaIntegration.checkPriceByLink(detail.link);
                if (effects && effects.length) {
                  effects.map(async (effect: string) => {
                    const effectLowerCase = effect.toLocaleLowerCase();
                    const data = await this.effectModel.getEffectByName(
                      effectLowerCase
                    );
                    let effectId = null;
                    if (sku) {
                      await this.detailModel.updateById(detail.id, {
                        sku,
                      });
                    }
                    if (!data) {
                      effectId = await this.effectModel.create({
                        name: effectLowerCase,
                      });
                    } else {
                      effectId = data.id;
                    }
                    await this.productEffectModel.create({
                      effectId,
                      productId,
                    });
                  });
                }
                if (oldPrice) {
                  await this.detailModel.updateOldPriceByDetailId(
                    oldPrice,
                    detail.id
                  );
                }
                if (price) {
                  await this.detailModel.updatePriceByDetailId(
                    price,
                    detail.id
                  );
                  await this.priceHistoryModel.create({
                    price,
                    productId,
                  });
                }
              }
            });
            await this.productUpdateModel.deleteById(id);
          } catch (err) {
            logger.error(
              `Error to update produt data with id ${productId} - ${err.message}`
            );
          }
        }),
      ]);
    }
  }

  checkPercentName(name1: string, name2: string): number {
    const words1 = name1.split(' ');
    const words2 = name2.split(' ');
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
