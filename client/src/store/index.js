import Vue from "vue";
import Vuex from "vuex";
import { getCoins } from "./../services";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        snackbar: { status: false },
        coins: []
    },
    getters: {
        nameCoins: state => {
            return state.coins.map(coin => coin.name);
        }
    },
    mutations: {
        SET_SNACKBAR(state, snackbar) {
            state.snackbar = snackbar;
        },
        SET_COINS(state, coins) {
            console.log(coins);
            state.coins = coins;
            console.log(state.coins);
        }
    },
    actions: {
        async getCoins({ commit }) {
            const result = await getCoins();
            console.log(result);
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
