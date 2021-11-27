export const state = () => ({
    isSidebarOpen: false,
    isPlaylistOpen: false,
    isLoginOpen: false,
    loginActiveComponent: 'login'
})

export const mutations = {
    mutateSetIsSidebarOpen(state, isSidebarOpen) {
        state.isSidebarOpen = isSidebarOpen
    },
    mutateSetIsPlaylistOpen(state, isPlaylistOpen) {
        state.isPlaylistOpen = isPlaylistOpen
    },
    mutateSetIsLoginOpen(state, isLoginOpen) {
        state.isLoginOpen = isLoginOpen
    },
    mutateSetLoginActiveComponent(state, loginActiveComponent) {
        state.loginActiveComponent = loginActiveComponent
    }
}

export const actions = {
    setIsSidebarOpen({ commit }, isSidebarOpen) {
        commit('mutateSetIsSidebarOpen', isSidebarOpen)
    },
    setIsPlaylistOpen({ commit }, isPlaylistOpen) {
        commit('mutateSetIsPlaylistOpen', isPlaylistOpen)
    },
    setIsLoginOpen({ commit }, isLoginOpen) {
        commit('mutateSetIsLoginOpen', isLoginOpen)
        commit('mutateSetLoginActiveComponent', 'login')
    },
    setLoginActiveComponent({ commit }, loginActiveComponent) {
        commit('mutateSetLoginActiveComponent', loginActiveComponent)
    }
}

export const getters = {
    isSidebarOpen(state) {
        return state.isSidebarOpen
    },
    isPlaylistOpen(state) {
        return state.isPlaylistOpen
    },
    isLoginOpen(state) {
        return state.isLoginOpen
    },
    loginActiveComponent(state) {
        return state.loginActiveComponent
    }
}
