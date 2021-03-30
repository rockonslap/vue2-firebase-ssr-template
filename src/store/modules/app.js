import * as types from '../types';

export default {
  state: {
    is_mobile: false,
    loading: false,
  },
  mutations: {
    [types.SET_IS_MOBILE](state, value) {
      state.is_mobile = value;
    },
    [types.APP_LOADING](state, value) {
      state.loading = value;
    },
  },
  actions: {
    setIsMobile({ commit }, data) {
      commit(types.SET_IS_MOBILE, data);
    },
    appLoading({ commit }, data) {
      commit(types.APP_LOADING, data);
    },
  },
};
