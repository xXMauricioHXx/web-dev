<template>
  <header class="masthead text-center text-white">
    <div class="masthead-content">
      <div class="container">
        <Title class="mb-0">Procure. Compare. Compre.</Title>
        <form v-on:submit.prevent="submit" class="search-form">
          <div class="form-group">
            <input class="form-control form-control-lg" type="text" v-model="product" />

            <label class="material-icons" v-on:click="submit">search</label>
          </div>
        </form>
      </div>
    </div>
    <div class="bg-circle-1 bg-circle"></div>
    <div class="bg-circle-2 bg-circle"></div>
    <div class="bg-circle-3 bg-circle"></div>
    <div class="bg-circle-4 bg-circle"></div>
  </header>
</template>

<script>
import Title from "./Title";
import { searchProducts } from "../services/makompare";

export default {
  name: "Banner",
  components: {
    Title
  },
  data() {
    return {
      product: ""
    };
  },
  methods: {
    submit() {
      this.$router.push(`/product-list?product=${this.product}`);
    }
  }
};
</script>

<style scoped>
.search-form {
  width: 80%;
  margin: 30px auto;
  position: relative;
}

.search-form label {
  color: #6610f2;
  position: absolute;
  top: 2px;
  right: 10px;
  padding: 11px;
  border-left: 1px solid #e8e7e9;
  height: 40px;
  font-weight: bold;
}

.search-form label:hover {
  cursor: pointer;
}

.search-form input {
  border-radius: 1.3rem;
}
.search-form input:focus {
  border-color: #6610f2;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(174, 0, 255, 0.25);
}

.autocomplete-result-mkc {
  color: black !important;
  text-align: left !important;
  z-index: 99999999999 !important;
}

@media (max-width: 575px) {
  .search-form {
    width: 100%;
    margin: 10px auto;
  }
}
</style>