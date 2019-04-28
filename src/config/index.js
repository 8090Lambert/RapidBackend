/*
 * Copyright (c) 2018. This file is part of the 8090Lambert/EasyBackend
 */
export const USER_TICKET = 'SSO_USER_TICKET';
export const USER_KEY = 'SSO_USER';

export const SSO_CONFIG = process.env.NODE_ENV === 'development' ? {
    APP_ID: 1234,
    APP_KEY: "",
    LOGIN_URL: "http://127.0.0.1/login",
    LOGOUT_URL: "http://127.0.0.1/logout",
} : {
    APP_ID: 1234,
    APP_KEY: "",
    LOGIN_URL: "http://127.0.0.1/login",
    LOGOUT_URL: "http://127.0.0.1/logout",
};


