import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import AsyncComputed from "vue-async-computed";

Vue.config.productionTip = false;

Vue.prototype.$appVersion = process.env.VUE_APP_BUILD || "DEVELOPMENT";

Vue.use(AsyncComputed);

new Vue({
    store,
    render: h => h(App)
}).$mount("#app");
