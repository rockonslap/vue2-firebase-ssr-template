<template>
  <div class="loading">
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
      };
    },
    props: {
    },
    computed: {
      ...mapState([
        'app',
      ]),
      lang() {
        return this.app.lang;
      },
      isMobile() {
        return this.app.is_mobile;
      },
    },
    components: {
    },
  };
</script>

<style lang="less">
  @import "../assets/less/_mixin.less";
  @import "../assets/less/_variable.less";

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 9999;

    &:before {
      content: '';
      background-color: #000;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.6;
    }
  }
</style>
