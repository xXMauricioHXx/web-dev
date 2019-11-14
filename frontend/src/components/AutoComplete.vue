<template>
  <form class="search-form">
    <div class="form-group">
      <input
        class="form-control form-control-lg"
        type="text"
        :placeholder="placeholder"
        @change="autoComplete"
        v-model="itemSelected"
      />
      <div class="form-auto-complete">
        <ul v-if="showItems">
          <li v-for="item in items" :key="item" @click="() => selectItem(item)">{{item}}</li>
        </ul>
      </div>
      <router-link :to="link">
        <label class="material-icons">search</label>
      </router-link>
    </div>
  </form>
</template>

<script>
export default {
  name: "AutoComplete",
  props: ["link", "placeholder", "search"],
  data() {
    return {
      searchMethod: this.search,
      items: [],
      itemSelected: null,
      showItems: false
    };
  },
  methods: {
    selectItem(item) {
      this.itemSelected = item;
      this.showItems = false;
    },
    async autoComplete(e) {
      console.log(e.target.value);
      // this.showItems = true;
      // this.items = await this.searchMethod(value);
    }
  },
  watch: {}
};
</script>

<style>
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
.autocomplete-input {
  background-image: none;
  background-repeat: no-repeat;
}

.form-auto-complete {
  background-color: #fff;
  color: #6b7b8e;
  width: 92%;
  margin-left: 1rem;
  display: flex;
}

.form-auto-complete ul {
  width: 100%;
  padding: 0px;
}

.form-auto-complete ul li {
  display: flex;
  padding: 0.3rem 1rem;
  width: 100%;
}

.form-auto-complete ul li:hover {
  background-color: #6610f2;
  cursor: pointer;
}

@media (max-width: 575px) {
  .search-form {
    width: 100%;
    margin: 10px auto;
  }
}
</style>