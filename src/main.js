import Vue from 'vue';
import 'normalize.css/normalize.css';

// element-ui.
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// custom bootstrap.
import './bootstrap.js';
// svg-icon
import '@icon';

// vue-router 、vuex and other utils.
import App from './App.vue'
import http from '@utils/http'
import router from './router/index.js'
import './middleware'

import store from './store'
import { sync } from 'vuex-router-sync'
sync(store, router);

Vue.use(ElementUI, {size: 'medium'});
Vue.config.productionTip = false;
Vue.prototype.$http = http;

new Vue({
    store,
    router,
    render: h => h (App),
}).$mount('#app');
