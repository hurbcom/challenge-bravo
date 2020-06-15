import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        snackbar: { status: false }
    },
    getters: {},
    mutations: {
        SET_SNACKBAR(state, snackbar) {
            state.snackbar = snackbar;
        }
    },
    actions: {
        showNotification({ commit }, notification) {
            commit("SET_SNACKBAR", {
                ...notification,
                status: true
            });
        },
        showError({ commit }, notification) {
            commit("SET_SNACKBAR", {
                ...notification,
                color: "red",
                status: true
            });
        }
    }
});
