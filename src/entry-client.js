import Vue from 'vue';
import { createApp } from './main';

const { app, store, router } = createApp();

Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options;
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
      }).then(next).catch(next);
    } else {
      next();
    }
  },
});

if (window.__INITIAL_STATE__) {
  store.replaceState(JSON.parse(JSON.stringify(window.__INITIAL_STATE__)));
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c));
    });
    if (!activated.length) {
      return next();
    }
    Promise.all(activated.map((c) => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to });
      }
    })).then(() => {
      next();
    }).catch(next);
  });

  app.$mount('#app');
});
