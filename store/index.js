export const state = () => ({
    isSidebarOpen: false,
    isPlaylistOpen: false
})

export const mutations = {
    mutateSetIsSidebarOpen(state, isSidebarOpen) {
        state.isSidebarOpen = isSidebarOpen
    },
    mutateSetIsPlaylistOpen(state, isPlaylistOpen) {
        state.isPlaylistOpen = isPlaylistOpen
    }
}

export const actions = {
    setIsSidebarOpen({ commit }, isSidebarOpen) {
        commit('mutateSetIsSidebarOpen', isSidebarOpen)
    },
    setIsPlaylistOpen({ commit }, isPlaylistOpen) {
        commit('mutateSetIsPlaylistOpen', isPlaylistOpen)
    }
}

export const getters = {
    isSidebarOpen(state) {
        return state.isSidebarOpen
    },
    isPlaylistOpen(state) {
        return state.isPlaylistOpen
    }
}
