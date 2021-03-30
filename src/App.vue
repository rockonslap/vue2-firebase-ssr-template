<template>
  <div id="app">
    <app-header></app-header>
    <div id="content" v-if="isRender">
      <router-view></router-view>
    </div>
    <template v-if="isRenderFooter">
      <app-footer></app-footer>
    </template>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  import Header from './components/Header/Header';
  import Footer from './components/Footer/Footer';
  import Loading from './components/Loading';

  export default {
    name: 'app',
    data() {
      return {};
    },
    components: {
      'app-header': Header,
      'app-footer': Footer,
      Loading,
    },
    computed: {
      ...mapState([
        'app',
        'route',
        'user',
      ]),
      isAuth() {
        return !this.user.isAnonymous;
      },
      isRender() {
        return true;
      },
      loading() {
        return this.app.loading ||
        this.user.loading ||
        this.user.facebook_login_loading ||
        this.user.email_login_loading ||
        this.user.email_sign_up_loading ||
        this.user.reset_password_loading ||
        this.user.sign_out_loading ||
        this.user.register_user_loading ||
        this.user.get_user_profile_loading ||
        this.user.update_user_profile_loading ||
        this.user.update_user_profile_image_loading ||
        this.user.get_user_credit_card_loading ||
        this.user.delete_user_credit_card_loading;
      },
      lang() {
        return this.app.lang;
      },
      isMobile() {
        return this.app.is_mobile;
      },
      isRenderFooter() {
        return true;
      },
    },
    methods: {
      ...mapActions([
        'setLang',
        'setIsMobile',
        'fetchUser',
      ]),
      checkMobileSize() {
        if (window.innerWidth < 992) {
          this.setIsMobile(true);
        } else {
          this.setIsMobile(false);
        }
      },
    },
    watch: {
      $route() {
        if (process.browser) {
          if (!this.route.from.name || this.route.from.name !== this.route.name) {
            this.closeSideNav();
            $('html, body').animate({ scrollTop: 0 }, 200);
          }
        }
      },
    },
    beforeMount() {
      // this.fetchUser();
    },
    mounted() {
      this.checkMobileSize();
      window.addEventListener('resize', this.checkMobileSize);
    },
  };
</script>

<style lang="less">
  @import "./assets/less/style.less";

  .page {
    min-height: 90vh;
  }
</style>
