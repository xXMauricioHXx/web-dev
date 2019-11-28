import cheerio from 'cheerio';
import axios from 'axios';
import { HttpIntegration } from './http';
import { ProductResponse } from './product';
import { ProductBrands } from '../../enums';
import { logger } from '../../logger';

export interface BelezaIntegrationConfig {
  baseURL: string;
}

export class BelezaIntegration extends HttpIntegration {
  constructor(config: BelezaIntegrationConfig) {
    super({
      baseURL: config.baseURL,
    });
  }

  async getInformation(html: string) {
    const obj: any = {};
    const $ = cheerio.load(html);
    const price = $('.nproduct-price-value')
      .text()
      .trim();
    obj.price = this.getPriceWithoutCurrencyFormat(price);
    obj.description =
      $('.product-description-content p')
        .text()
        .replace('\n', '')
        .trim() ||
      $('.product-description-content div')
        .text()
        .replace('\n', '')
        .trim();
    const oldPrice = $('.nproduct-price-max').text();
    obj.oldPrice = oldPrice && this.getPriceWithoutCurrencyFormat(oldPrice);
    obj.intallmentsInformation = $('.nproduct-price-installments')
      .text()
      .trim();
    obj.brand = $('.datasheet-characteristics .info-line')
      .eq(2)
      .text()
      .replace('\n', '')
      .trim()
      .match(/([A-z].)+/gm)![1];

    obj.effects = $('.datasheet-characteristics .info-line')
      .eq(1)
      .text()
      .match(/([A-z].+)/gm);
    obj.imageData = $('.zoomContainer').html();
    obj.name = $('.nproduct-title')
      .text()
      .trim()
      .replace('\n', '');
    console.log(obj);
  }

  protected getPriceWithoutCurrencyFormat(price: string): number {
    return parseFloat(
      price
        .match(/(([0-9].+),([0-9].))/gm)!
        .join('')
        .replace(',', '.')
    );
  }

  async formatResponse(html: string, cep?: string): Promise<any[]> {
    const $ = cheerio.load(html);
    const products: ProductResponse[] = [];
    $('.showcase-item').each(async function(index) {
      const obj: any = {};
      // @ts-ignore
      const element = $(this).html() || '';

      obj.itemId = $('.js-add-to-cart')
        .attr('data-sku')
        .replace('[', '')
        .replace(']', '');
      obj.name = $('.showcase-item-name', element).children(
        'a'
      )[1].attribs.title;
      obj.image = $('.showcase-item-image a img', element)
        .attr('data-src')
        .trim();
      obj.price = $('.item-price-value', element)
        .text()
        .trim();
      obj.oldPrice = $('.item-price-max', element)
        .text()
        .trim();
      obj.description = $('.showcase-item-description', element)
        .text()
        .trim();

      obj.brand = $('.showcase-item-name a strong', element)
        .text()
        .trim()
        .replace(/[^\w\s]/gi, '')
        .toLocaleLowerCase();
      obj.siteImage =
        'https://cuponomia-a.akamaihd.net/img/stores/original/beleza-na-web.png';
      obj.siteLink = $('.showcase-item-image a', element).attr('href');
      obj.brandName = ProductBrands.Beleza;
      products.push(obj);
    });

    return await Promise.all(
      products.map(async (product: ProductResponse, index) => {
        try {
          const response = await axios.get(product.link);

          const installments = $('.nproduct-price-installments', response.data)
            .text()
            .trim();

          product.installments = this.getIntallments(installments);
        } catch (err) {
          logger.info(
            `Não foi possivel pegar informações do produto ${product.name} - ERROR ${err.message}`
          );
        }
        return product;
      })
    );
  }

  getIntallments(installments?: string): number | undefined {
    if (installments) {
      const intallmentsNumber = installments.match(/.*[0-9]x/gm);
      return intallmentsNumber ? parseInt(intallmentsNumber[0], 10) : undefined;
    }
    return undefined;
  }

  getInstallmentsPrice(installments?: string): string | undefined {
    if (installments) {
      const intallmentsPrice = installments.match(/R\$.*/gm);
      return intallmentsPrice ? intallmentsPrice[0] : undefined;
    }
    return undefined;
  }

  async getProductsWithShippingPrice(sku: string, cep: string): Promise<any> {
    const response = await this.instance.get(`/busca?q=${sku}`);
    await this.getInformation(response.data);
  }
}
