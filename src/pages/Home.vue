<template>
  <div class="page home-page">Home Page</div>
</template>

<script>
  import { mapState } from 'vuex';
  // import q from 'q';

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
    },
    // asyncData({ store }) {
    //   return q.Promise((resolve) => {
    //     let count = 0;

    //     function successAsync() {
    //       count++;
    //       if (count === 1) {
    //         resolve();
    //       }
    //     }

    //     store.dispatch('someThing').then(() => {
    //       successAsync();
    //     });
    //   });
    // },
  };
</script>

<style lang="less">
  @import "../assets/less/_mixin.less";
  @import "../assets/less/_variable.less";

  .home-page {
    
  }
</style>
