import { Notification } from 'element-ui'
import * as api from '@utils/helpers';

// 拦截器interceptors
export default http => {
    // 请求拦截
    http.interceptors.request.use(
        config => {
            //config.withCredentials = true;  // 跨域开关
            return config;
        },
        error => {
            return Promise.reject(error)
        }
    );

    // 统一响应
    http.interceptors.response.use(
        response => {
            return response
        },
        error => {
            if (!error.response) {
                return Promise.reject(error)
            }

            switch (error.response.status) {
                case 401:
                    if (process.env.NODE_ENV !== 'development') {
                        Notification.error({
                            title: '未登陆',
                            message: '您还没有登陆，请先登陆~'
                        });
                        // Unauthorized
                        api.jumpLogin();
                    }
                    break;
                case 403:
                    Notification.error({
                        title: '错误',
                        message: '对不起，您没有权限操作~'
                    });
                    break;
                case 500:
                case 501:
                case 502:
                case 503:
                case 504:
                    Notification.error({
                        title: '错误',
                        message: '服务器除了点小问题，程序员小哥哥要被扣工资了~'
                    });
                    break;
            }

            return Promise.reject(error.response)
        }
    )

}
