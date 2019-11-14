<template>
  <div class="col-xs-12 col-md-6 col-lg-3 mkc-card">
    <div class="card border-0 mkc-card-content">
      <div class="mkc-favorite" :class="{'mkc-favorite-carousel': isCarousel }">
        <i class="material-icons">favorite_border</i>
      </div>
      <img :src="product.image" class="card-img-top mkc-image-list" alt="..." />
      <div class="card-body">
        <h6 class="card-title">{{product.title}}</h6>
        <div class="mkc-product-info-list">
          <div class="mkc-product-description mt-3">{{product.description}}</div>
          <span class="mt-1 ante-price">A partir de:</span>
          <h6 class="mkc-price-list">
            {{product.price}}
            <span
              class="mkc-find-in"
              :class="{'mkc-find-in-carousel': isCarousel}"
            >
              em
              <span class="mkc-color-f4">{{product.companies.length}} lojas</span>
            </span>
          </h6>
        </div>
        <div class="mkc-card-action-list">
          <router-link :to="`/product-detail/${product._id}`">Comparar</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardWithoutBtn",
  props: {
    product: {
      type: Object,
      required: true
    },
    isCarousel: {
      type: Boolean
    }
  },
  data() {
    return {
      hideText: false
    };
  }
};
</script>

<style scoped>
.card {
  text-align: center;
  position: relative;
}
.mkc-card {
  display: flex;
}

.mkc-card-content {
  transition: 0.5s;
  position: relative;
}

.product-container {
  margin-bottom: 15rem;
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

.mkc-product-info-list .ante-price {
  font-size: 1.3rem;
  font-weight: 900;
  display: block;
}

.mkc-product-description {
  font-size: 0.9rem;
}
.mkc-product-info-list .ante-price {
  font-size: 0.8rem;
}

.mkc-card-action-list {
  background-color: #dedede;
  width: 85%;
  margin: 0px;
  height: 3rem;
  text-align: center;
  font-weight: 700;
  text-align: center;
  margin: 0px auto;
  background-color: #f42d4b;
  color: white;
  font-weight: 400;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.5s;
  -webkit-box-shadow: 0px 5px 4px 0px rgba(168, 168, 168, 1);
  -moz-box-shadow: 0px 5px 4px 0px rgba(168, 168, 168, 1);
  box-shadow: 0px 5px 4px 0px rgba(168, 168, 168, 1);
}

.mkc-card-action-list:hover {
  background-color: #c7374d;
  font-weight: 600;
}

.mkc-find-in {
  font-size: 12pt;
  color: black;
}

.mkc-card-action-list a {
  display: block;
  padding: 0.7rem 0px;
  color: #fff;
  text-decoration: none;
}

.mkc-favorite {
  border: 1px solid #c9c9c9;
  position: absolute;
  padding: 0.7rem;
  right: 43px;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

.mkc-favorite:hover {
  opacity: 0.5;
  cursor: pointer;
}

.mkc-favorite-carousel {
  border: 1px solid #c9c9c9;
  position: absolute;
  padding: 0.7rem;
  right: 20px !important;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

.mkc-find-in-carousel {
  display: block;
}

@media (max-width: 576px) {
  .mkc-card-action-list {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .mkc-card-action-list {
    width: 100%;
  }
}

/* // Large devices (desktops, 992px and up)
@media (min-width: 992px) { ... }

// Extra large devices (large desktops, 1200px and up)
@media (min-width: 1200px) { ... } */
</style>