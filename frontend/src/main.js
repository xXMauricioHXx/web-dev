import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueWindowSize from "vue-window-size";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

Vue.use(Autocomplete);
Vue.use(VueWindowSize);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
