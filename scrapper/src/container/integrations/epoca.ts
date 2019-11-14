import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { HttpIntegration } from "./http";
import { ProductResponse } from "./product";
import { logger } from "../../logger";
import { ProductBrands } from "../../enums";

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
      baseURL: config.baseURL
    });
    this.epocaFreteURL = config.freteURL;
  }

  protected formatPriceToInt(price: string): number {
    return parseInt(price.replace("R$", "").replace(",", ""), 10) / 100;
  }
  protected formatCurrencyBRL(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  protected async formatResponse(
    response: AxiosResponse,
    cep?: string
  ): Promise<ProductResponse[]> {
    const products: GetProductsResponse[] = response.data.placements[0].docs;
    return await Promise.all(
      products.map(async (product: GetProductsResponse) => {
        const obj = {};
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
              shippingPrice = "Não foi possível calcular frete nesse CEP";
              logger.info(err.response);
            }

            if (
              shippingPrice !== "Não foi possível calcular frete nesse CEP" &&
              shippingPrice !== "Frete Grátis"
            ) {
              priceWithShipping =
                this.formatPriceToInt(shippingPrice) + salePriceCents;
            }
          }
          const installments = product.Installment
            ? product.Installment.replace(":", ",")
            : "";

          return {
            itemId,
            name: product.name,
            price: this.formatCurrencyBRL(salePriceCents),
            oldPrice: this.formatCurrencyBRL(oldPrice),
            description: product.description,
            installments: this.getIntallments(installments),
            installmentsPrice: this.getInstallmentsPrice(installments),
            image: product.imageId,
            brand: product.brand.replace(/[^\w\s]/gi, "").toLocaleLowerCase(),
            siteImage: "https://staticz.com.br/img/logos/epoca-cosmeticos.png",
            siteLink: product.linkId,
            category: "",
            shippingPrice,
            priceWithShipping: priceWithShipping
              ? this.formatCurrencyBRL(priceWithShipping)
              : undefined,
            brandName: ProductBrands.EPOCA,
            complete: true
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
    cep: string
  ): Promise<ProductResponse[]> {
    const uri = `/?lang=pt&query=${productName}&userId=&placement=search_page.find&start=0&rows=24`;
    const response = await this.instance.get<GetProductsResponse>(uri);
    return this.formatResponse(response, cep);
  }

  async getPriceShipping(itemId: string, cep: string): Promise<string> {
    const response = await axios.get(
      `${this.epocaFreteURL}/${itemId}?shippinCep=${cep}&quantity=1`
    );

    const $ = cheerio.load(response.data);
    const shippingText = $("tbody tr td").text();
    const value = shippingText.match(/R\$\d.*,\d.|Frete Grátis/gm);
    return value ? value[0] : "Não foi possível calcular frete nesse CEP";
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
}
