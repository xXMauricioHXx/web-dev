<template>
  <div :class="`loader ${loading || 'hidden'}`">
    <img src="/imgs/1.gif" />
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
.loader {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  position: fixed;
  top: 0px;
  transition: 1s;
}

.loader img {
  display: block;
  margin: 8rem auto;
}

.hidden {
  opacity: 0;
  display: none;
}
</style>
