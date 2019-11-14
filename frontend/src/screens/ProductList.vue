<template>
  <div>
    <Menu />
    <section class="mt-6 product-container">
      <div class="container-fluid pl-0">
        <div class="row mkc-product-list">
          <div class="col d-none d-md-block col-md-2 mkc-filter-list pl-0">
            <h5>Marca</h5>
            <ul>
              <li v-for="brand in catalog.brands" :key="brand">
                <Radio :label="brand" :filter="filterBrands" />
              </li>
            </ul>

            <h5>Preço</h5>
            <ul>
              <li v-for="price in catalog.rangePrice" :key="price">
                <Radio :label="price" :filter="filterPrice" />
              </li>
            </ul>
          </div>
          <div class="col col-xs-12 col-md-10 col-lg-10 pl-0 pr-0">
            <Title class="capitalize">{{title}}</Title>
            <div class="row">
              <Card v-for="product in products" :product="product" v-bind:key="product.id" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <Loader :loading="loading" />
  </div>
</template>

<script>
import { searchProducts } from "../services/makompare";
import Menu from "../components/Menu.vue";
import Title from "../components/Title";
import Card from "../components/Card";
import Radio from "../components/Radio";
import Loader from "../components/Loader";

export default {
  name: "ProductList",
  components: {
    Menu,
    Title,
    Card,
    Radio,
    Loader
  },
  data() {
    return {
      title: this.$route.query.product,
      catalog: {
        brands: ["MAC", "Eudora", "Vult", "Natura Una", "Dior"],
        rangePrice: [
          "Até R$ 5,00",
          "De R$ 5,00 á R$ 20,00",
          "De R$ 20,00 á R$ 50,00",
          "Acima de R$ 50,00"
        ]
      },
      loading: true,
      allProducts: [],
      products: [],
      brandTofilter: [],
      pricesToFilter: []
    };
  },
  async mounted() {
    const product = this.$route.query.product;
    this.products = await searchProducts(product);
    this.allProducts = this.products;
    this.loading = false;
  },
  methods: {
    filterBrands(brand) {
      const brandLower = brand.toLowerCase();
      if (this.brandTofilter.includes(brandLower)) {
        this.brandTofilter = this.brandTofilter.filter(brands => {
          return brands != brandLower;
        });
      } else {
        this.brandTofilter.push(brandLower);
      }

      if (this.brandTofilter.length) {
        this.products = this.allProducts.filter(product => {
          return this.brandTofilter.includes(product.brand);
        });
      } else {
        this.products = this.allProducts;
      }
    },
    filterPrice(price) {
      if (this.pricesToFilter.includes(price)) {
        this.pricesToFilter = this.pricesToFilter.filter(pricesToFilter => {
          return pricesToFilter !== price;
        });
      } else {
        this.pricesToFilter.push(price);
      }

      if (this.pricesToFilter.length) {
        let products = [];
        this.pricesToFilter.forEach(price => {
          products = [
            ...products,
            ...this.allProducts.filter(product => {
              const value = parseFloat(
                product.price.match(/([\d.*,.*\d]+)/g)[0]
              ).toFixed(2);
              if (price === "Até R$ 5,00") {
                return value <= 5.0;
              }

              if (price === "De R$ 5,00 á R$ 20,00") {
                return value > 5.0 && value <= 20.0;
              }

              if (price === "De R$ 20,00 á R$ 50,00") {
                return value > 20.0 && value <= 50.0;
              }

              if (price === "Acima de R$ 50,00") {
                return value > 50.0;
              }
            })
          ];
        });
        this.products = products;
      } else {
        this.products = this.allProducts;
      }
    }
  }
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
.product-container {
  margin-bottom: 15rem;
}

.mt-6 {
  margin-top: 4rem;
}

.mkc-image-list {
  width: 60%;
  display: block;
  margin: 1rem auto;
}

.mkc-product-list {
  padding: 0px;
  margin: 0px;
}

.mkc-product-list div ul li {
  display: inline;
}
.mkc-product-info-list .ante-price {
  font-size: 1.3rem;
  font-weight: 900;
  display: block;
}

.mkc-product-description {
  font-size: 0.9rem;
}

.mkc-price-list {
  font-weight: 900;
  font-size: 1.7rem;
  color: #33052d;
  font-family: "Lato";
}

.mkc-product-info-list .ante-price {
  font-size: 0.8rem;
}

.mkc-card-action-list {
  background-color: #f2f2f2;
}

.mkc-filter-list {
  background-color: #f2f2f2;
  padding: 2rem !important;
}
</style>