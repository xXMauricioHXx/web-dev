import Vue from "vue";
import Router from "vue-router";
import Home from "./screens/Home.vue";
import ProductList from "./screens/ProductList.vue";
import ProductDetail from "./screens/ProductDetail.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/product-list",
      name: "product-list",
      component: ProductList
    },
    {
      path: "/product-detail/:id",
      name: "product-detail",
      component: ProductDetail
    }
  ]
});
