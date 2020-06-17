import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import AsyncComputed from "vue-async-computed";
import vuetify from './plugins/vuetify';
Vue.config.productionTip = false;

Vue.prototype.$appVersion = process.env.VUE_APP_BUILD || "DEVELOPMENT";

Vue.use(AsyncComputed);

new Vue({
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");
