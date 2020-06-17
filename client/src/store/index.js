import Vue from "vue";
import Vuex from "vuex";
import { getCoins } from "./../services";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        coins: []
    },
    getters: {
        nameCoins: state => {
            return state.coins.map(coin => coin.name);
        }
    },
    mutations: {
        SET_COINS(state, coins) {
            state.coins = coins;
        }
    },
    actions: {
        async getCoins({ commit }) {
            const result = await getCoins();
            commit("SET_COINS", result);
        }
    }
});
