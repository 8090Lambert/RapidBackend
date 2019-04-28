import Cookie from 'js-cookie';
import * as TYPES from './mutation-types'

const App = {
    state : {
        sidebar: {
            opened: !+Cookie.get('sidebar_status'),
            withoutAnimation: false
        },
        device: 'desktop',
    },
    mutations: {
        [TYPES.SIDEBAR_TOGGLE] (state) {
            if (state.sidebar.opened) {
                Cookie.set('sidebar_status', 1);
            } else {
                Cookie.set('sidebar_status', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
        },
        [TYPES.SIDEBAR_CLOSE] (state, withoutAnimation) {
            Cookie.set('sidebar_status', 1);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
        [TYPES.DEVICE_TOGGLE] (state, device) {
            state.device = device;
        }
    },
    actions: {
        SidebarToggle: ({ commit }) => {
            commit(TYPES.SIDEBAR_TOGGLE);
        },
        SidebarClose: ({ commit }, { withoutAnimation }) => {
            commit(TYPES.SIDEBAR_CLOSE, withoutAnimation);
        },
        DeviceToggle: ({commit}, device) => {
            commit(TYPES.DEVICE_TOGGLE, device)
        }
    },
    getters: {
        sidebar: ({sidebar}) => sidebar,
        deviceType: ({device}) => device,
    }
};

export default App
