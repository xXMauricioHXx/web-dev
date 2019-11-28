import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { HttpIntegration } from './http';
import { ProductResponse } from './product';
import { logger } from '../../logger';

export interface EpocaIntegrationConfig {
  baseURL: string;
  freteURL: string;
}

export interface GetProductsResponse {
  skuJson: string;
  salePriceCents: number;
  priceCents: number;
  name: string;
  description: string;
  imageId: string;
  Installment: string;
  brand: string;
  linkId: string;
}

export class EpocaIntegration extends HttpIntegration {
  protected readonly epocaFreteURL: string;
  constructor(config: EpocaIntegrationConfig) {
    super({
      baseURL: config.baseURL,
    });
    this.epocaFreteURL = config.freteURL;
  }

  protected formatPriceToInt(price: string): number {
    return parseInt(price.replace('R$', '').replace(',', ''), 10) / 100;
  }

  protected async formatResponse(
    response: AxiosResponse,
    cep?: string
  ): Promise<ProductResponse[]> {
    const products: GetProductsResponse[] = response.data.placements[0].docs;
    return await Promise.all(
      products.map(async (product: GetProductsResponse) => {
        try {
          const sku = JSON.parse(product.skuJson);
          const salePriceCents = product.salePriceCents / 100;
          const oldPrice = product.priceCents / 100;
          const itemId = sku[0].itemId;
          let shippingPrice = undefined;
          let priceWithShipping = undefined;

          if (cep) {
            try {
              shippingPrice = await this.getPriceShipping(itemId, cep);
            } catch (err) {
              shippingPrice = 'Não foi possível calcular frete nesse CEP';
              logger.info(err.response);
            }

            if (
              shippingPrice !== 'Não foi possível calcular frete nesse CEP' &&
              shippingPrice !== 'Frete Grátis'
            ) {
              priceWithShipping =
                this.formatPriceToInt(shippingPrice) + salePriceCents;
            }
          }
          const installments = product.Installment
            ? product.Installment.replace(':', ',')
            : '';

          return {
            itemId,
            oldPrice,
            priceWithShipping,
            shippingPrice,
            name: product.name,
            price: salePriceCents,
            description: product.description,
            installments: this.getIntallments(installments),
            installmentsPrice: this.getInstallmentsPrice(installments),
            imageUrl: product.imageId,
            link: product.linkId,
            brand: product.brand,
          };
        } catch (err) {
          logger.info(`Não foi possivel pegar `);
          throw err;
        }
      })
    );
  }

  async getProducts(productName: string): Promise<ProductResponse[]> {
    const uri = `/?lang=pt&query=${productName}&userId=&placement=search_page.find&start=0&rows=24`;
    const response = await this.instance.get<GetProductsResponse>(uri);
    return await this.formatResponse(response);
  }

  async getProductsWithShippingPrice(
    productName: string,
    cep: string,
    start: number,
    end: number
  ): Promise<ProductResponse[]> {
    const uri = `/?lang=pt&query=${productName}&userId=&placement=search_page.find&start=${start}&rows=${end}`;
    const response = await this.instance.get<GetProductsResponse>(uri);
    return this.formatResponse(response, cep);
  }

  async getPriceShipping(itemId: string, cep: string): Promise<string> {
    const response = await axios.get(
      `${this.epocaFreteURL}/${itemId}?shippinCep=${cep}&quantity=1`
    );

    const $ = cheerio.load(response.data);
    const shippingText = $('tbody tr td').text();
    const value = shippingText.match(/R\$\d.*,\d.|Frete Grátis/gm);
    return value ? value[0] : 'Não foi possível calcular frete nesse CEP';
  }

  async checkPrice(itemId: string) {
    const response = await axios.get(
      `https://middle.epocacosmeticos.net.br/search-sku.php?idSku=${itemId}`
    );

    const data = response.data[0];
    if (!data) {
      logger.info(`No data found to product with id ${itemId}`);
      return {
        effects: undefined,
        price: undefined,
      };
    }
    const items = data.items;
    const effects = data.Efeito;
    if (!effects || !effects.length) {
      logger.info(`No effects founded to item id ${itemId}`);
    }
    let minorPrice = 0;
    if (items && items.length) {
      items.forEach((item: any) => {
        const price = item.sellers[0].commertialOffer.Price;

        if (minorPrice === 0 || price < minorPrice) {
          minorPrice = price;
        }
      });
    } else {
      logger.info(`No items founded to item id ${itemId}`);
    }

    return {
      effects,
      price: minorPrice,
    };
  }

  async checkPriceByLink(link: string) {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);
    const price = $('.skuBestPrice').text();
    const effects = $('.value-field.Efeito').text();
    const oldPrice = $('.skuListPrice').text();
    const sku = $('.sku-ean-code').text();
    return {
      sku,
      price: this.clearMoneyFormat(price),
      effects: effects ? effects.split(',') : undefined,
      oldPrice: this.clearMoneyFormat(oldPrice),
    };
  }

  protected getIntallments(installments?: string): number | undefined {
    if (installments) {
      const intallmentsNumber = installments.match(/.*[0-9]x/gm);
      return intallmentsNumber ? parseInt(intallmentsNumber[0], 10) : undefined;
    }
    return undefined;
  }

  protected getInstallmentsPrice(installments?: string): number | undefined {
    if (installments) {
      const intallmentsPrice = installments.match(/R\$.*/gm);
      return intallmentsPrice
        ? this.clearMoneyFormat(intallmentsPrice[0])
        : undefined;
    }
    return undefined;
  }

  protected clearMoneyFormat(data: string): number {
    console.log(data);
    return parseFloat(data.replace('R$', '').replace(',', '.'));
  }
}
