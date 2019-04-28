/*
 * Copyright (c) 2018. This file is part of the 8090Lambert/EasyBackend
 */
import Cookie from 'js-cookie';
import _ from 'lodash';
import * as config from '@config';
import * as TYPES from './mutation-types';

const Auth = {
    state: {
        user: {},
        ticket: null,
    },
    mutations: {
        [TYPES.SET_USER] (state, value) {
            state.user = value
        },
        [TYPES.SET_TICKET] (state, value) {
            state.ticket = value
        }
    },
    actions: {
        checkLogin: ({dispatch, state}) => {
            // When development environment
            if (process.env.NODE_ENV === 'development') {
                Cookie.set(config.USER_TICKET, 'test_ticket');
                Cookie.set(config.USER_KEY, 'developer');
            }

            // If ticket is exists then all validation has been done.
            if (!_.isEmpty(state.ticket)) {
                return Promise.resolve(state.ticket);
            }

            // Read from cookie.
            let user_ticket = Cookie.get(config.USER_TICKET);
            let user = {name: Cookie.get(config.USER_KEY)};
            if (_.isEmpty(user_ticket)) {
                return Promise.reject(false);
            }

            return dispatch('setTicket', user_ticket).then(() => {
                dispatch('setUser', user);
            });
        },
        setUser: ({commit}, user) => {
            commit(TYPES.SET_USER, user);

            Promise.resolve(user);
        },
        setTicket: ({commit}, ticket) => {
            commit(TYPES.SET_TICKET, ticket);

            Promise.resolve(ticket);
        },
        // api 直接写cookie，不需要单独获取一次，后续有需要更丰富的用户信息再考虑.
        // loadUser: ({dispatch}) => {
        //     api.getUserInfo().then(user => dispatch('setUser', user));
        // }
    },
    getters: {
        currentUser: ({ user }) => user,
        authTicket: ({ ticket }) => ticket,
    }
};

export default Auth;
