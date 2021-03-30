import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '../pages/Home';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    // scrollBehavior: () => ({ x: 0, y: 0 }),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: HomePage,
      },
    ],
  });
}
