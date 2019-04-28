import router from './router'
import store from './store'
import NProgress from "nprogress";
import 'nprogress/nprogress.css'
import * as api from '@utils/helpers'

// Needless Authentication
const whileList = [
    '/404'
];
const needAuth = (route) => _.includes(whileList, route.path) || route.meta.auth === true;

// NProgress Configuration
NProgress.configure({ showSpinner: false , easing: 'ease', speed: 600 });

// preposition middleware
router.beforeEach((to, from, next) => {
    if (needAuth(to)) {
        store.dispatch('checkLogin').catch(() => {
            api.jumpLogin();
        })
    }
    NProgress.start();
    next()
});

// terminate middleware
router.afterEach(() => {
    NProgress.done();
});

