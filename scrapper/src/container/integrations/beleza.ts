import cheerio from "cheerio";
import axios from "axios";
import { HttpIntegration } from "./http";
import { ProductResponse } from "./product";
import { ProductBrands } from "../../enums";
import { logger } from "../../logger";

export interface BelezaIntegrationConfig {
  baseURL: string;
}

export class BelezaIntegration extends HttpIntegration {
  constructor(config: BelezaIntegrationConfig) {
    super({
      baseURL: config.baseURL
    });
  }

  async formatResponse(html: string, cep?: string): Promise<ProductResponse[]> {
    const $ = cheerio.load(html);
    const products: ProductResponse[] = [];
    $(".showcase-item").each(async function(index) {
      const obj: any = {};
      // @ts-ignore
      const element = $(this).html() || "";

      obj.itemId = $(".js-add-to-cart")
        .attr("data-sku")
        .replace("[", "")
        .replace("]", "");
      obj.name = $(".showcase-item-name", element).children(
        "a"
      )[1].attribs.title;
      obj.image = $(".showcase-item-image a img", element)
        .attr("data-src")
        .trim();
      obj.price = $(".item-price-value", element)
        .text()
        .trim();
      obj.oldPrice = $(".item-price-max", element)
        .text()
        .trim();
      obj.description = $(".showcase-item-description", element)
        .text()
        .trim();

      obj.brand = $(".showcase-item-name a strong", element)
        .text()
        .trim()
        .replace(/[^\w\s]/gi, "")
        .toLocaleLowerCase();
      obj.siteImage =
        "https://cuponomia-a.akamaihd.net/img/stores/original/beleza-na-web.png";
      obj.siteLink = $(".showcase-item-image a", element).attr("href");
      obj.brandName = ProductBrands.BELEZA;
      products.push(obj);
    });

    return await Promise.all(
      products.map(async (product: ProductResponse, index) => {
        try {
          const response = await axios.get(product.siteLink);

          const installments = $(".nproduct-price-installments", response.data)
            .text()
            .trim();

          product.installments = this.getIntallments(installments);
          product.installmentsPrice = this.getInstallmentsPrice(installments);
          product.complete = true;
        } catch (err) {
          logger.info(
            `Não foi possivel pegar informações do produto ${product.name} - ERROR ${err.message}`
          );
          product.complete = false;
        }
        return product;
      })
    );
  }

  getIntallments(installments?: string): number | undefined {
    if (installments) {
      const intallmentsNumber = installments.match(/.*[0-9]x/gm);
      return intallmentsNumber ? parseInt(intallmentsNumber[0]) : undefined;
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

  async getProductsWithShippingPrice(
    productName: string,
    cep: string
  ): Promise<ProductResponse[]> {
    const pages = 10;
    let currentPage = 0;
    const products: ProductResponse[] = [];
    try {
      for (let page = 1; page <= pages; page++) {
        currentPage = page;
        const response = await this.instance.get(
          `/busca?q=batom${productName}&pagina=${page}`
        );
        products.push(...(await this.formatResponse(response.data)));
      }
    } catch (err) {
      logger.info(
        `Não foi possivel pegar os dados da página ${currentPage} - ERROR ${err.message}`
      );
    }
    return products;
  }
}
