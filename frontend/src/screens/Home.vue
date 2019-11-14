<template>
  <div>
    <Menu />
    <Banner />
    <Carousel />
  </div>
</template>
<script>
import Menu from "../components/Menu";
import Banner from "../components/Banner";
import Carousel from "../components/Carousel";

export default {
  name: "Home",
  components: {
    Menu,
    Banner,
    Carousel
  }
};
</script>