import Vue from "vue";
import Vuex from "vuex";
import { getCoins } from "./../services";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        coins: [],
        snackbar: { status: false }
    },
    getters: {
        nameCoins: state => {
            return state.coins.map(coin => coin.name);
        }
    },
    mutations: {
        SET_COINS(state, coins) {
            state.coins = coins;
        },

        SET_SNACKBAR(state, snackbar) {
            state.snackbar = snackbar;
        }
    },
    actions: {
        async getCoins({ commit }) {
            const result = await getCoins();
            commit("SET_COINS", result);
        },

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
