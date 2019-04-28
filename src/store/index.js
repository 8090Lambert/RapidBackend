/*
 * Copyright (c) 2018. This file is part of the 8090Lambert/EasyBackend
 */

import Vue from 'vue'
import Vuex from 'vuex'

// modules.
import User from './modules/auth'
import Base from './modules/app'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth: User,
        app: Base,
    }
});

