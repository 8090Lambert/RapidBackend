import store from '@root/store'

const { body } = document;
const WIDTH = 1024;
const RATIO = 3;

export default {
    watch: {
        $route(route) {
            if (this.device === 'mobile' && this.sidebar.opened) {
                store.dispatch('SidebarClose', { withoutAnimation: false })
            }
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.resizeHandler)
    },
    mounted() {
        const isMobile = this.isMobile();
        if (isMobile) {
            store.dispatch('DeviceToggle', 'mobile');
            store.dispatch('SidebarClose', { withoutAnimation: true })
        }
    },
    methods: {
        isMobile() {
            const rect = body.getBoundingClientRect();
            return rect.width - RATIO < WIDTH
        },
        resizeHandler() {
            if (!document.hidden) {
                const isMobile = this.isMobile();
                store.dispatch('DeviceToggle', isMobile ? 'mobile' : 'desktop');

                if (isMobile) {
                    store.dispatch('SidebarClose', { withoutAnimation: true })
                }
            }
        }
    }
}
