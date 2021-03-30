import 'babel-polyfill';
import Vue from 'vue';

import { sync } from 'vuex-router-sync';
import Vuelidate from 'vuelidate';

import App from './App';
import { createRouter } from './router';
import { createStore } from './store';
import titleMixin from './mixins/title';
import seoImageMixin from './mixins/seo-image';
import seoDescriptionMixin from './mixins/seo-description';

if (process.browser) {
  // For No SSR External Component (Use require instead of import)
}

Vue.use(Vuelidate);

Vue.mixin(titleMixin);
Vue.mixin(seoImageMixin);
Vue.mixin(seoDescriptionMixin);


export function createApp() {
  const store = createStore();
  const router = createRouter();

  sync(store, router);

  const app = new Vue({
    router,
    store,
    render: h => h(App),
  });
  return { app, store, router };
}
