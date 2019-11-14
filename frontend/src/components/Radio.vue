<template>
  <div :class="{'mkc-radio-selected mkc-radio':  selected}" class="mkc-radio" @click="select">
    <div class="mkc-radio-ball"></div>
    <label>{{label}}</label>
  </div>
</template>

<script>
export default {
  name: "Radio",
  props: {
    label: {
      type: String,
      required: true
    },
    filter: {
      required: false
    }
  },

  data() {
    return {
      selected: false
    };
  },
  methods: {
    select() {
      this.selected = this.selected ? false : true;
      this.filter(this.label);
    }
  }
};
</script>

<style scoped>
.mkc-radio label {
  position: relative;
}

.mkc-radio label:hover {
  cursor: pointer;
}

.mkc-radio-selected label::before {
  content: "";
  position: absolute;
  width: 1rem;
  height: 1rem;
  left: -22px;
  top: 4px;
  border: none;
  border-radius: 50%;
  background-color: #f42d4b;
}

.mkc-radio label::before {
  content: "";
  position: absolute;
  width: 1rem;
  height: 1rem;
  left: -22px;
  top: 4px;
  border: 1px solid black;
  border-radius: 50%;
}
</style>