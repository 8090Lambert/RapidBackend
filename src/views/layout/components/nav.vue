<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
        <breadcrumb />
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" :title="me">
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <router-link class="inlineBlock" to="/">
                    <el-dropdown-item>
                        <svg-icon icon-class="user" />
                        Home
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided>
                    <span style="display:block;" @click="logout"><svg-icon icon-class="logout" /> LogOut</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Breadcrumb from '@components/crumb'
    import Hamburger from '@components/hamburger'
    import * as api from '@utils/helpers';

    export default {
        components: {
            Breadcrumb,
            Hamburger
        },
        data() {
            return {
                // 默认头像
                avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            }
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'currentUser'
            ]),
            me() {
                if (this.currentUser.name !== undefined) {
                    return this.currentUser.name.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
                }
                return 'Developer';
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('SidebarToggle');
            },
            logout() {
                // 退出登录
                api.loginOut();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                line-height: initial;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>

