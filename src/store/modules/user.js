import q from 'q';
import { auth, provider, requestApi } from 'api';
import * as types from '../types';

let alertify;
if (process.browser) {
  alertify = require('alertifyjs');
}

export default {
  state: {
    uid: '',
    email: '',
    isAnonymous: true,
    isEmailLogin: true,
    profile: {},
    loading: false,
    facebook_login_loading: false,
    email_login_loading: false,
    email_sign_up_loading: false,
    reset_password_loading: false,
    sign_out_loading: false,
    register_user_loading: false,
    get_user_profile_loading: false,
    update_user_profile_loading: false,
    update_user_profile_image_loading: false,
    get_user_credit_card_loading: false,
    delete_user_credit_card_loading: false,
  },
  mutations: {
    [types.FETCH_USER](state, payload) {
      state.loading = false;
      state.uid = payload.uid;
      state.email = payload.email;
      state.isAnonymous = payload.isAnonymous;
      if (payload.providerData.length) {
        state.isEmailLogin = false;
      } else if (payload.email) {
        state.isEmailLogin = true;
      } else {
        state.isEmailLogin = false;
      }
    },
    [types.LOADING_USER](state, value) {
      state.loading = value;
    },
    [types.SET_ANONYMOUS](state, value) {
      state.loading = false;
      state.isAnonymous = value;
      if (value) {
        state.profile = {};
      }
    },
    [types.LOADING_FACEBOOK_LOGIN](state, value) {
      state.facebook_login_loading = value;
    },
    [types.LOADING_EMAIL_LOGIN](state, value) {
      state.email_login_loading = value;
    },
    [types.LOADING_EMAIL_SIGN_UP](state, value) {
      state.email_sign_up_loading = value;
    },
    [types.LOADING_RESET_PASSWORD](state, value) {
      state.reset_password_loading = value;
    },
    [types.LOADING_SIGN_OUT](state, value) {
      state.sign_out_loading = value;
    },
    [types.REGISTER_USER_LOADING](state, value) {
      state.register_user_loading = value;
    },
    [types.GET_USER_PROFILE_LOADING](state, value) {
      state.get_user_profile_loading = value;
    },
    [types.GET_USER_PROFILE](state, payload) {
      state.profile = { ...payload };
      state.get_user_profile_loading = false;
    },
    [types.UPDATE_USER_PROFILE_LOADING](state, value) {
      state.update_user_profile_loading = value;
    },
    [types.UPDATE_USER_PROFILE_IMAGE_LOADING](state, value) {
      state.update_user_profile_image_loading = value;
    },
    [types.FETCH_USER_CREDIT_CARD_LOADING](state, value) {
      state.get_user_credit_card_loading = value;
    },
    [types.DELETE_USER_CREDIT_CARD_LOADING](state, value) {
      state.delete_user_credit_card_loading = value;
    },
  },
  actions: {
    fetchUser({ state, commit, dispatch }) {
      if (process.browser) {
        commit(types.LOADING_USER, true);
      }
      auth.onAuthStateChanged((user) => {
        if (user) {
          commit(types.FETCH_USER, user);
          if (!state.isAnonymous && !state.register_user_loading) {
            dispatch('getUserProfile');
          }
        } else {
          auth
            .signInAnonymously()
            .catch(() => {});
          commit(types.SET_ANONYMOUS, true);
        }
      });
    },
    facebookLogIn({ commit, dispatch }) {
      return q.Promise((resolve) => {
        if (process.browser) {
          commit(types.LOADING_FACEBOOK_LOGIN, true);
        }
        auth.signInWithPopup(provider)
          .then(() => {
            commit(types.LOADING_FACEBOOK_LOGIN, false);
            dispatch('registerUser');
            resolve();
          }).catch((err) => {
            commit(types.LOADING_FACEBOOK_LOGIN, false);
            alertify.alert('', err.message);
          });
      });
    },
    emailLogIn({ commit }, data) {
      return q.Promise((resolve) => {
        if (process.browser) {
          commit(types.LOADING_EMAIL_LOGIN, true);
        }
        auth.signInWithEmailAndPassword(data.email, data.password)
          .then(() => {
            commit(types.LOADING_EMAIL_LOGIN, false);
            resolve();
          })
          .catch((err) => {
            commit(types.LOADING_EMAIL_LOGIN, false);
            alertify.alert('', err.message);
          });
      });
    },
    emailSignUp({ commit, dispatch }, data) {
      return q.Promise((resolve) => {
        if (process.browser) {
          commit(types.LOADING_EMAIL_SIGN_UP, true);
        }
        auth.createUserWithEmailAndPassword(data.email, data.password)
          .then(() => {
            commit(types.LOADING_EMAIL_SIGN_UP, false);
            dispatch('registerUser', data);
            resolve();
          })
          .catch((err) => {
            commit(types.LOADING_EMAIL_SIGN_UP, false);
            alertify.alert('', err.message);
          });
      });
    },
    signOut({ commit }) {
      return q.Promise((resolve) => {
        if (process.browser) {
          commit(types.LOADING_SIGN_OUT, true);
        }
        auth.signOut()
          .then(() => {
            commit(types.LOADING_SIGN_OUT, false);
            alertify.notify('Sign out success', 'success', 5);
            resolve();
          }).catch(() => {
            commit(types.LOADING_SIGN_OUT, false);
            alertify.alert('', err.message);
          });
      });
    },
    registerUser({ commit, dispatch }, data) {
      return q.Promise((resolve) => {
        commit(types.REGISTER_USER_LOADING, true);
        auth.currentUser.getIdToken().then((token) => {
          requestApi({
            method: 'POST',
            path: 'users',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            payload: data,
          }).then(() => {
            commit(types.REGISTER_USER_LOADING, false);
            dispatch('getUserProfile');
            resolve();
          });
        });
      });
    },
    getUserProfile({ commit }) {
      return q.Promise((resolve) => {
        commit(types.GET_USER_PROFILE_LOADING, true);
        auth.currentUser.getIdToken().then((token) => {
          requestApi({
            method: 'GET',
            path: 'me',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((resp) => {
            commit(types.GET_USER_PROFILE, resp.data.data);
            resolve();
          }).catch(() => {
            commit(types.GET_USER_PROFILE, {});
            resolve();
          });
        });
      });
    },
    updateUserProfile({ commit, dispatch }, data) {
      return q.Promise((resolve) => {
        commit(types.UPDATE_USER_PROFILE_LOADING, true);
        auth.currentUser.getIdToken().then((token) => {
          requestApi({
            method: 'PUT',
            path: 'me',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            payload: data,
          }).then(() => {
            commit(types.UPDATE_USER_PROFILE_LOADING, false);
            dispatch('getUserProfile');
            resolve();
          });
        });
      });
    },
    updateUserProfileImageLoading({ commit }, data) {
      commit(types.UPDATE_USER_PROFILE_IMAGE_LOADING, data);
    },
    fetchUserCreditCardLoading({ commit }, data) {
      commit(types.FETCH_USER_CREDIT_CARD_LOADING, data);
    },
    deleteUserCreditCardLoading({ commit }, data) {
      commit(types.DELETE_USER_CREDIT_CARD_LOADING, data);
    },
    resetPasswordLoading({ commit }, data) {
      commit(types.LOADING_RESET_PASSWORD, data);
    },
  },
};
