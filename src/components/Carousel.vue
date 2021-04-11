<template>
  <div>
    <div class="img-wrapper">
      <div
        class="overlay"
        :style="{ backgroundImage: 'url(' + img + ')' }"
      ></div>
      <img :src="concert.description.img" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    concert: Object,
  },
  mounted() {
    this.img = this.concert.description.img;
  },
  data() {
    return {
      img:
        "https://p-u.popcdn.net/hero_images/desktop_images/000/000/164/medium/5592700a49ee2e6cf2a0ac8f96ae49eac99224a5.jpg?1617442334",
    };
  },
};
</script>

<style lang="scss" scope>
.img-wrapper {
  position: relative;
  height: 400px;
  overflow: hidden;
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    background-position: center;
    background-size: cover;
    filter: blur(8px);
    z-index: 0;
  }
  img {
    margin: 0 auto;
    width: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: block;
    z-index: 1;
    transition: ease-in-out 0.7s;
    object-fit: cover;
    &:hover {
      transform: scale(1.2);
    }
  }
}
</style>
