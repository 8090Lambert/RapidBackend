<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <!-- or name="fade" -->
             <router-view :key="key"></router-view>
        </transition>
    </section>
</template>

<script>
    export default {
        name: 'app-main',
        computed: {
            key() {
                // 随机一个key, 确保不同的router使用同一个components会重新渲染.
                return this.$route.name !== undefined ? this.$route.name + +Math.random() : this.$route + +Math.random()
            }
        }
    }
</script>

<style scoped>
    .app-main {
        /*50 = navbar  */
        min-height: calc(100vh - 50px);
        position: relative;
        overflow: hidden;
    }
</style>
