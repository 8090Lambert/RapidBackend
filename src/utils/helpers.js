/*
 * Copyright (c) 2018. This file is part of the 8090Lambert/EasyBackend
 */
import { default as http } from '@utils/http'
import * as config from '@config';
import Cookie from 'js-cookie';

export const jumpLogin = () => {
    let queryParams = {
        app_id: config.SSO_CONFIG.APP_ID,
        jumpto: encodeURIComponent(window.location.href),
        version: config.SSO_CONFIG.VERSION
    };
    window.location.href = config.SSO_CONFIG.LOGIN_URL + '?' + window.$.param(queryParams);
};


export const loginOut = () => {
    Cookie.remove(config.USER_TICKET);
    Cookie.remove(config.USER_KEY);
    http.get('/logout');
    window.location.href = config.SSO_CONFIG.LOGOUT_URL + '?app_id=' + config.SSO_CONFIG.APP_ID;
};


export const currentDate = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth()+1;
    let day = currentDate.getDate() < 10 ? '0'+currentDate.getDate() : currentDate.getDate();
    let hour = currentDate.getHours() < 10 ? '0'+currentDate.getHours() : currentDate.getHours();
    let minute = currentDate.getMinutes() < 10 ? '0'+currentDate.getMinutes() : currentDate.getMinutes();
    let seconds = currentDate.getSeconds() < 10 ? '0'+currentDate.getSeconds() : currentDate.getSeconds();

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
};


export const isExternal = (path) => {
    return /^(https?:|mailto:|tel:)/.test(path)
};
