<template>
  <footer class="footer">
  </footer>
</template>

<script>
  import { mapState } from 'vuex';
  import Icon from '../../elements/Icon';

  export default {
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
      Icon,
    },
  };
</script>

<style lang="less">
  @import "../../assets/less/_mixin.less";
  @import "../../assets/less/_variable.less";

  .footer {
  }
</style>
