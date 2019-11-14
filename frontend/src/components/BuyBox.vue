<template>
  <div class="row mck-bk-ff p-3 mb-4">
    <div class="col-md-3 mkc-product-image">
      <img :src="product.image" />
    </div>
    <div class="col-md-9">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <Title class="mkc-title">{{product.title}}</Title>
          </div>
          <div class="col-12 mkc-description" v-html="product.description"></div>
          <div class="col-12">
            <span class="mkc-find-in">A partir de:</span>
            <span class="mkc-price-list">{{product.price}}</span>
            <span class="mkc-price-parcela">
              Ou
              <span>
                <span class="mkc-color-f4">{{product.installments}}x</span> de
                <span class="mkc-color-f4">{{product.installmentsPrice}}</span>
              </span> em
              <span>{{product.foundIn}} lojas</span>
            </span>
          </div>
          <div class="col-12">
            <div class="mkc-list-action">
              <ul class="p-0 mt-3">
                <li>
                  <a :href="product.siteLink">
                    <i class="material-icons">launch</i> Ir para Loja
                  </a>
                </li>
                <li>
                  <i class="material-icons">add_alert</i> Alerta de preço
                </li>
                <li>
                  <i class="material-icons">trending_up</i>
                  Acompanhar Grafico
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "./Title";

export default {
  name: "BuyBox",
  components: {
    Title
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.mkc-title {
  font-size: 16pt;
}
.mkc-find-in {
  font-size: 11pt;
  font-weight: 600;
  color: black;
  display: block;
}
.mkc-product-image img {
  width: 80%;
}

.mkc-product-image-brand img {
  width: 100%;
  padding: 1rem 0.3rem;
}

.mkc-price-parcela {
  margin: 0.5rem;
}
.mkc-price-parcela span {
  font-weight: bold;
}

.mkc-description {
  margin-bottom: 1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.mkc-list-action ul li {
  display: inline;
  background-color: #f42d4b;
  padding: 0.5rem 1.2rem;
  font-size: 10pt;
  color: #fff;
  margin-right: 1rem;
  transition: 0.5s;
  -webkit-box-shadow: 0px 5px 4px 0px rgba(168, 168, 168, 1);
  -moz-box-shadow: 0px 5px 4px 0px rgba(168, 168, 168, 1);
  box-shadow: 0px 5px 4px 0px rgba(168, 168, 168, 1);
}

.mkc-list-action ul li a {
  text-decoration: none;
  color: #fff;
}

.mkc-list-action ul li i {
  vertical-align: text-bottom;
  margin-right: 0.3rem;
  font-size: 14pt;
}

.mkc-list-action ul li:hover {
  background-color: #c7374d;
  cursor: pointer;
}
</style>