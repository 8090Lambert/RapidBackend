import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/* Layout */
import Layout from '@views/layout/Layout';

/**
 * For example:
 *
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             use with cached
 * meta : {
    auth: true                   this property will control whether need to jump sso login
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/

export const routes = [
    // 首页
    {path: '', component: Layout, redirect:'dashboard', children: [
            {
                path: 'dashboard',
                component: () => import('@views/dashboard/'),
                name: 'Dashboard',
                meta: {title: '首页', icon: 'dashboard'},
            }
        ]
    },

    // 定时任务
    {path: '/task', name:'Task', component: Layout, redirect: 'noredirect', meta: {
        title: '计划任务',
        icon: 'schedule',
    }, children: [
            {
                path: "index",
                component: () => import('@views/task/task-list'),
                name: 'TaskIndex',
                meta: {auth:true, title: '任务列表', icon: 'list'}
            },
            {
                path: "create",
                component: () => import('@views/task/task-create'),
                name: 'TaskCreate',
                meta: {auth:true, title: '添加任务', icon: 'example'}
            },
            {
                path: "edit/:id(\\d+)",
                component: () => import('@views/task/task-detail'),
                name: 'TaskEdit',
                hidden: true,
                meta: {auth:true, title: '编辑任务'}
            }
        ]
    },
    {path: '*', redirect: '/404', hidden: true},
    {path: '/404', component: () => import('@views/404'), hidden: true}
];

const router = new Router({
    routes: routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    mode: 'history',
});

export default router
